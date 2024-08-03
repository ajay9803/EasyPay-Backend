import { Knex } from "knex";
import db from "../utils/db";

/**
 * BaseModel class which serves as the base class for all models
 * It provides a connection to the database using knex and a query builder method
 *
 * @class BaseModel
 */
export default class BaseModel {
  static connection: Knex = db;
  static queryBuilder() {
    return this.connection;
  }
}
