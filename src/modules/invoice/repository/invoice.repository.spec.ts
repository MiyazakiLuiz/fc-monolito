import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceItemModel } from "./invoice-item.model"
import { InvoiceModel } from "./invoice.model"
import InvoiceItem from "../domain/invoice-item.entity"
import Invoice from "../domain/invoice.entity"
import InvoiceRepository from "./invoice.repository"

describe("Invoice Repository test", () => {

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

    const invoiceItem = new InvoiceItem({
      id: new Id("1"),
      name: "invoice item 1",
      price: 10,
    });
    
    const address = new Address(
      "Rua 123",
      "99",
      "Casa Verde",
      "Criciúma",
      "SC",
      "88888-888",
    );
    
    const invoice = new Invoice({
      id: new Id("1"),
      name: "invoice",
      document: "document",
      address: address,
      items: [invoiceItem],
      total: 10,
    });

    const repository = new InvoiceRepository()
    await repository.add(invoice)

    const invoiceDb = await InvoiceModel.findOne({ include: [InvoiceItemModel], where: { id: "1" } })

    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id).toEqual(invoice.id.id)
    expect(invoiceDb.name).toEqual(invoice.name)
    expect(invoiceDb.document).toEqual(invoice.document)
    expect(invoiceDb.street).toEqual(invoice.address.street)
    expect(invoiceDb.number).toEqual(invoice.address.number)
    expect(invoiceDb.complement).toEqual(invoice.address.complement)
    expect(invoiceDb.city).toEqual(invoice.address.city)
    expect(invoiceDb.state).toEqual(invoice.address.state)
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode)
    expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.id)
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name)
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price)
    expect(invoiceDb.total).toEqual(invoice.total)
    expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt)
  })

  it("should find an invoice", async () => {
    const invoice = await InvoiceModel.create({
      id: '1',
      name: "invoice",
      document: "document",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",      
      total: 10,
      createdAt: new Date(),
    })

    const invoiceItem = await InvoiceItemModel.create({
      id: '1',
      invoiceId: '1',
      name: "invoice item 1",
      price: 10,
    })

    const repository = new InvoiceRepository()
    const result = await repository.find(invoice.id)

    expect(result.id.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address.street).toEqual(invoice.street)
    expect(result.address.number).toEqual(invoice.number)
    expect(result.address.complement).toEqual(invoice.complement)
    expect(result.address.city).toEqual(invoice.city)
    expect(result.address.state).toEqual(invoice.state)
    expect(result.address.zipCode).toEqual(invoice.zipcode)
    expect(result.items[0].id.id).toEqual(invoiceItem.id)
    expect(result.items[0].name).toEqual(invoiceItem.name)
    expect(result.items[0].price).toEqual(invoiceItem.price)
    expect(result.total).toEqual(invoice.total)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
  })
})