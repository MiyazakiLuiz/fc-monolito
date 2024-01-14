import Address from "../../../@shared/domain/value-object/address";
import InvoiceGateway from "../../gateway/invoce.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";

export default class FindInvoiceUsecase {
  private repository: InvoiceGateway;

  constructor(repository: InvoiceGateway) {
    this.repository = repository;
  }

  async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    const res = await this.repository.find(input.id);

    return {
      id: res.id.id,
      name: res.name,
      document: res.document,
      address: {
        street: res.address.street,
        number: res.address.number,
        complement: res.address.complement,
        city: res.address.city,
        state: res.address.state,
        zipCode: res.address.zipCode
      },
      items: res.items.map(i => ({
        id: i.id.id,
        name: i.name,
        price: i.price,
      })),
      total: res.total,
      createdAt: res.createdAt,
    }
  }
}