export default function handler (req, res) {
  console.log(req.body)
  console.log(req.query)
  console.log(req.cookies)
  res.json({ data: 'hello world' })
  res.end()
}

