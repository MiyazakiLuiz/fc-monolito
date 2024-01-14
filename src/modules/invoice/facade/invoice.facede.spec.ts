import { Sequelize } from "sequelize-typescript"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemModel } from "../repository/invoice-item.model"
import InvoiceFacedeFactory from "../factory/invoice.facade.factory"

const facade = InvoiceFacedeFactory.create();

describe("Invoice Facade test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create an invoice", async () => {

    const input = {
      name: "invoice",
      document: "document",
      street: "street",
      number: "50",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "88888-888",
      items: [{
        id: "1",
        name: "item 1",
        price: 10,
      },
      {
        id: "2",
        name: "item 2",
        price: 20,
      }],
    }

    const result = await facade.generate(input)

    const invoiceDb = await InvoiceModel.findOne({ include: [InvoiceItemModel], where: { id: result.id } })

    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id).toBe(result.id)
    expect(invoiceDb.total).toBe(30)
  })

  it("should find an invoice", async () => {
    const input = {
      name: "invoice",
      document: "document",
      street: "street",
      number: "50",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "88888-888",
      items: [{
        id: "1",
        name: "item 1",
        price: 10,
      },
      {
        id: "2",
        name: "item 2",
        price: 20,
      }],
    }

    const result = await facade.generate(input)

    const invoice = await facade.find({ id: result.id })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBe(result.id)
    expect(invoice.name).toBe(input.name)
    expect(invoice.document).toBe(input.document)
    expect(invoice.address.street).toBe(input.street)
    expect(invoice.address.number).toBe(input.number)
    expect(invoice.address.complement).toBe(input.complement)
    expect(invoice.address.city).toBe(input.city)
    expect(invoice.address.state).toBe(input.state)
    expect(invoice.address.zipCode).toBe(input.zipCode)
    expect(invoice.total).toBe(result.total)
    expect(invoice.items).toHaveLength(input.items.length)
  })
})