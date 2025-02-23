import { Router } from "express"
import { AppDataSource } from "../../data-source"
import { Gate, IGateConnection } from "./../../entity"
import { SPACEFLIGHT_COST } from "./../../constants/constants"

const router = Router()

// define the home page route
router.get('/', async (req, res) => {
  
  const gates = await AppDataSource.getRepository(Gate).find()
  res.json(gates)

})

router.get('/:id', async (req, res) => {

  const { id } = req.params

  const gate = await AppDataSource.getRepository(Gate).findOneBy({ id })
  if (!gate) {
    res.status(404).send(`No Gate found by ID "${id}"`)
    return
  }
  res.json(gate)

})

router.get('/:locationId/to/:destinationId', async (req, res) => {

  const { locationId, destinationId } = req.params

  const gates = await AppDataSource.getRepository(Gate).find()
  const locationGate = gates.find(gate => gate.id === locationId)
  const destinationGate = gates.find(gate => gate.id === destinationId)

  if (!locationGate || !destinationGate) {
    res.status(404).send(`No Gate found by ID "${!locationGate ? locationId : destinationId}"`)
    return
  }

  // Track successful paths here
  const destinationPaths: Array<Array<IGateConnection>> = []
  
  // Helper function
  const findRoute = (currentLocation: IGateConnection, visited: Array<string>, pathList: Array<IGateConnection>) => {

    if (visited.includes(currentLocation.id)) return

    const currentGate = gates.find(gate => gate.id === currentLocation.id)
    // Should never happen
    if (!currentGate) throw new Error('Gate ID mismatch')

    const { connections } = currentGate

    if (currentLocation.id === destinationId) {
      destinationPaths.push([...pathList, currentLocation])
    }

    connections.forEach(conn => findRoute(conn, [...visited, currentLocation.id], [...pathList, currentLocation]))

  }

  // Set current location as start of route
  findRoute({ id: locationId, hu: '0' }, [], [])

  const parsedData = destinationPaths.map(path => {
    return {
      route: path.map(connection => connection.id),
      totalCost: path.reduce((acc, connection) => acc + parseInt(connection.hu), 0) * SPACEFLIGHT_COST
    }
  })

  const cheapest = parsedData.reduce((prev, curr) => prev.totalCost < curr.totalCost ? prev : curr)

  res.send({
    from: locationGate,
    to: destinationGate,
    ...cheapest,
  })

})

export default router