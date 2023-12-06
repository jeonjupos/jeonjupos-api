import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetTablesDto } from './dto/get-tables.dto';
import { PoolConnection } from 'mysql2/promise';
import { GetTableDto } from "./dto/get-table.dto";

@Injectable()
export class TablesModel {
  private sql: string;
  private params: any[];
  constructor(private databaseService: DatabaseService) {}

  /**
   * 테이블 목록 조회
   * @param connection
   * @param getTablesDto
   */
  async getTableList(connection: PoolConnection, getTablesDto: GetTablesDto) {
    try {
      this.sql = `
        select space.spacepkey, space.spacenum, eatingyn, if(orderprice is null, 0, orderprice) orderprice
        from space 
        left join orderinfo on space.spacepkey=orderinfo.spacepkey
        where space.storepkey=? and isactiveyn=true
        order by spacenum asc
      `;
      this.params = [getTablesDto.storepkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 테이블 목록 조회에 필요한 주문내역 조회
   * @param connection
   * @param spacepkey
   */
  async getTablesOrderList(connection: PoolConnection, spacepkey: number) {
    try {
      this.sql = `
        select 
            ordermenu.menuname menuname,
            sum(if(cancelyn=true, -ordermenu.count, ordermenu.count)) count,
            sum(if(cancelyn=true, -ordermenu.count * ordermenu.saleprice, ordermenu.count * ordermenu.saleprice)) saleprice
        from orderinfo
        join ordernumticket on orderinfo.orderinfopkey=ordernumticket.orderinfopkey
        join ordermenu on ordernumticket.ordernumticketpkey=ordermenu.ordernumticketpkey
        where orderinfo.spacepkey=?
        group by ordermenu.menupkey, ordermenu.menuname
        order by ordermenu.menupkey desc
        limit 5;
      `;
      this.params = [spacepkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 주문서 정보 조회
   * @param connection
   * @param getTableDto
   */
  async getOrderInfo(connection: PoolConnection, getTableDto: GetTableDto) {
    try {
      this.sql = `
        select 
            orderinfopkey, orderinfopkey, paysuccessyn, orderprice, 
            reserveyn, date_format(reservedate, '%Y-%m-%d %H:%i') reservedate, deliveryyn, deliveryaddress, 
            date_format(regdate, '%Y-%m-%d %H:%i') regdate
        from orderinfo 
        where spacepkey=?
      `;
      this.params = [getTableDto.spacepkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 결제후 남은 금액 조회
   * @param connection
   * @param orderinfopkey
   */
  async getPayInfo(connection: PoolConnection, orderinfopkey: number) {
    try {
      this.sql = `
        select expectedrestprice 
        from payinfo
        where orderinfopkey=?
        order by payinfopkey desc
        limit 1
      `;
      this.params = [orderinfopkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 주문 메뉴 목록 조회
   * @param connection
   * @param orderinfopkey
   */
  async getOrderMenuList(connection: PoolConnection, orderinfopkey: number) {
    try {
      this.sql = `
        select 
            menu.menupkey menupkey,
            ordermenu.menuname menuname,
            sum(if(cancelyn=true, -ordermenu.count, ordermenu.count)) count,
            sum(if(cancelyn=true, -ordermenu.count, ordermenu.count)) cancelableqty,
            menu.saleprice,
            sum(if(cancelyn=true, -ordermenu.count * ordermenu.saleprice, ordermenu.count * ordermenu.saleprice)) orderprice
        from orderinfo
        join ordernumticket on orderinfo.orderinfopkey=ordernumticket.orderinfopkey
        join ordermenu on ordernumticket.ordernumticketpkey=ordermenu.ordernumticketpkey
        join menu on ordermenu.menupkey=menu.menupkey
        where orderinfo.orderinfopkey=?
        group by menu.menupkey, ordermenu.menuname
        order by menu.menupkey desc
      `;
      this.params = [orderinfopkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }
}
