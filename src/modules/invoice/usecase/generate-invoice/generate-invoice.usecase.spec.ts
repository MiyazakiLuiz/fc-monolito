import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItem from "../../domain/invoice-item.entity"
import Invoice from "../../domain/invoice.entity"
import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn()
  }
}

describe("Generate Invoice use case unit test", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

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

    const result =  await usecase.execute(input)

    expect(repository.add).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.document).toEqual(input.document)
    expect(result.items.length).toEqual(input.items.length)
    expect(result.total).toEqual(input.items.reduce((res, elem) => res + elem.price, 0))
  })
})