import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";

@Table({
  tableName: 'invoice_item',
  timestamps: false
})
export class InvoiceItemModel extends Model {
  [x: string]: any;
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @ForeignKey(() => InvoiceModel)
  invoiceId: string

  @Column({ allowNull: false })
  name: string

  @Column({ allowNull: false })
  price: number
}