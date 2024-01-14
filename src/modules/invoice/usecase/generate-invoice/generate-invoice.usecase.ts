import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoce.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase {
  private repository: InvoiceGateway
  
  constructor(repository: InvoiceGateway) {
    this.repository = repository
  }

  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {

    const items: InvoiceItem[] = input.items.map((item) => {
      let props = {
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      }

      return new InvoiceItem(props)
    })

    const total = input.items.reduce((acc, item) => acc + item.price, 0)

    const address = new Address(
      input.street,
      input.number,
      input.complement,
      input.city,
      input.state,
      input.zipCode
    )

    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: address,
      items: items,
      total: total
    })

    await this.repository.add(invoice)

    return {
      id: invoice.id.id,
      ...input,
      total: invoice.total
    }
  }

}