import { Router } from "express"
import { PERSONAL_COST, HSTC_COST } from "./../../constants/constants"

const router = Router()

// define the home page route
router.get('/:distance', (req, res) => {

  const { distance } = req.params
  const { passengers, parking } = req.query

  if (!passengers || !parking) {
    res.status(400).send(`Field "${!passengers ? 'Passengers' : 'Parking'}" is mandatory`)
    return
  }

  if (isNaN(+distance) || isNaN(+passengers) || isNaN(+parking)){
    res.status(400).send(`Invalid value entered for field "${isNaN(+distance) ? 'Distance' : isNaN(+passengers) ? 'Passengers' : 'Parking'}"`)
    return
  }

  // personal transportation costs
  const personalFuelCosts = +distance * PERSONAL_COST.FUEL
  const personalStorageCosts = +parking * PERSONAL_COST.STORAGE
  const personalCost = (personalFuelCosts + personalStorageCosts) * Math.ceil(+passengers / PERSONAL_COST.CAPACITY)

  // hstc transportation costs
  const hstcFuelCosts = +distance * HSTC_COST.FUEL
  const hstcCost = (hstcFuelCosts) * Math.ceil(+passengers / HSTC_COST.CAPACITY)

  const usePersonal = (personalCost < hstcCost)

  res.send({
    totalCost: usePersonal ? personalCost : hstcCost,
    journeyCost: usePersonal ? personalFuelCosts : hstcFuelCosts,
    parkingCost: usePersonal ? personalStorageCosts : 0,
    recommendedTransport: {
      name: usePersonal ? 'Personal Transport' : 'HSTC Transport',
      capacity: usePersonal ? PERSONAL_COST.CAPACITY : HSTC_COST.CAPACITY,
      ratePerAu: usePersonal ? PERSONAL_COST.FUEL : HSTC_COST.FUEL
    }
  })
})

export default router