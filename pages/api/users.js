const users = [{ id: 1,message:"user1" }, { id: 2,message:"user2" }, { id: 3,message:"user3" }]

export default function handler(req, res) {
  // Get data from your database
  res.status(200).json(users)
}