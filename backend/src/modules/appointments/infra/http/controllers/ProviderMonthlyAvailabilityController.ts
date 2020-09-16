import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthlyAvailabilityService from '@modules/appointments/services/ListProviderMonthlyAvailabilityService';

export default class ProviderMonthlyAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.query;
 
    const listProviderMonthlyAvailabilityService = container.resolve(ListProviderMonthlyAvailabilityService);
 
    const availability = await listProviderMonthlyAvailabilityService.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });
 
    return response.json(availability);
  }
}
