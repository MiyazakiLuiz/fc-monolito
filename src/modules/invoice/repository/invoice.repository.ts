import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoce.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async add(entity: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: entity.id.id,
      name: entity.name,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipcode: entity.address.zipCode,
      total: entity.total,
      createdAt: entity.createdAt,
    })

    for (let i = 0; i < entity.items.length; i++) {
      const elem: InvoiceItem = entity.items[i]
      await InvoiceItemModel.create({
        id: elem.id.id,
        invoiceId: entity.id.id,
        name: elem.name,
        price: elem.price,
      })
    }
  }

  async find(id: string): Promise<Invoice> {

    const invoice = await InvoiceModel.findOne({ include: [InvoiceItemModel], where: { id } })

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    let items: InvoiceItem[] = []

    invoice.items.forEach((element: InvoiceItemModel) => {
      const item = new InvoiceItem({
        id: new Id(element.id),
        name: element.name,
        price: element.price,
      })
      items.push(item)
    })

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipcode,
      ),
      items: items,
      total: invoice.total,
      createdAt: invoice.createdAt,
    })
  }

}