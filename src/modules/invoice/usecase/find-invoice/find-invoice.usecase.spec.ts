import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUsecase from "./find-invoice.usecase";

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


const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    add: jest.fn(),
  };
};

describe("Unit Test Find Invoice", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUsecase(repository);

    const input = { id: "1" };
    const output = await usecase.execute(input);

    expect(output.id).toEqual(invoice.id.id);
    expect(output.name).toEqual(invoice.name);
    expect(output.document).toEqual(invoice.document);
    expect(output.address.zipCode).toEqual(invoice.address.zipCode);
    expect(output.address.number).toEqual(invoice.address.number);
    expect(output.items[0].id).toEqual(invoice.items[0].id.id);
    expect(output.items[0].name).toEqual(invoice.items[0].name);
    expect(output.items[0].price).toEqual(invoice.items[0].price);
    expect(output.total).toEqual(invoice.total);
  });

});