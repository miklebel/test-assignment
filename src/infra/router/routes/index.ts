import { Request, Response } from 'express'
import { db } from '../../database'
import { TableColumns } from '../../database/constants/index'

interface TableParameters {
  orderBy?: string
  desc?: string
  page?: string
}

export const indexRoute = async (req: Request<unknown, unknown, unknown, TableParameters>, res: Response) => {
  try {
    const { desc = 'false', orderBy = '1', page = '1' } = req.query

    const offset = ((parseInt(page) || 1) - 1) * 20

    const [{ rows }, countRes, { rows: graphRows }] = await Promise.all([
      db.query(
        `SELECT d.id AS listing_id,
              EXTRACT(MONTH
                      FROM d.created_at) AS listing_month,
              to_char(d.created_at, 'DD-MM-YYYY') AS listing_date,
              s.title AS broker,
              d.revenue AS revenue
          FROM deals d
          JOIN sites s ON d.site_id = s.id
          ORDER BY ${TableColumns[orderBy]}
          ${desc === 'true' ? 'DESC' : 'ASC'}
          LIMIT 20
          OFFSET ${offset}
          `
      ),
      db.query(`SELECT count(id) as count
                FROM deals`),
      db.query(
        `SELECT a.listing_month AS listing_month,
                round(avg(a.revenue)) AS avg_revenue,
                s.title AS site
          FROM
          (SELECT EXTRACT(MONTH
                          FROM d.created_at) AS listing_month,
                  d.site_id AS site_id,
                  d.revenue AS revenue,
                  to_char(d.created_at, 'DD-MM-YYYY') AS listing_date
            FROM deals d
            WHERE listing_date BETWEEN '01-11-2020' AND '01-11-2021') a
          JOIN sites s ON a.site_id = s.id
          GROUP BY site,
                  listing_month`
      )
    ])

    const count = countRes.rows[0].count
    console.log(graphRows)

    res.render('home', { rows, count, page, orderBy, desc, graphRows: JSON.stringify(graphRows) })
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}
