import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "./invoice-item.entity";

type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItem[];
  total: number;
  createdAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: InvoiceItem[];
  private _total: number;

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
    this._total = props.total;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  get items(): InvoiceItem[] {
    return this._items;
  }

  get total(): number {
    return this._total;
  }

  set name(name: string) {
    this._name = name;
  }

  set document(document: string) {
    this._document = document;
  }

  set address(address: Address) {
    this._address = address;
  }

  set items(items: InvoiceItem[]) {
    this._items = items;
  }

  set total(total: number) {
    this._total = total;
  }
}