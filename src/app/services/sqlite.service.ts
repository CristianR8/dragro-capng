import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
  capSQLiteChanges,
  capSQLiteValues
} from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class SqliteService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private readonly DB_NAME = 'dr_agro.db';

  constructor() {
    // ← Aquí el cambio clave:
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  public async initialize(): Promise<void> {
    if (this.db) {
      console.log('SQLite: DB ya inicializada, reutilizando conexión');
      return;
     }
    try {
      // crea (o abre) la conexión
      console.log('SQLite: creando conexión a', this.DB_NAME);
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        false,
        'no-encryption',
        1,
        false
      );
      await this.db.open();

      // crea la tabla si no existe
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS usuario (
          id INTEGER PRIMARY KEY NOT NULL,
          perfil TEXT,
          departamento TEXT,
          departamentoId INTEGER,
          municipio TEXT,
          municipioId INTEGER,
          correo TEXT
        );
      `);
    } catch (err) {
      console.error('Error inicializando SQLite:', err);
      throw err;
    }
  }

  public async addUsuario(data: {
    perfil: string;
    departamento: string;
    departamentoId: number;
    municipio: string;
    municipioId: number;
    correo: string;
  }): Promise<capSQLiteChanges> {
    if (!this.db) {
      throw new Error('DB no inicializada. Llama a initialize() antes.');
    }
    try {
      const res = await this.db.run(
        `INSERT INTO usuario
           (perfil, departamento, departamentoId, municipio, municipioId, correo)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [
          data.perfil,
          data.departamento,
          data.departamentoId,
          data.municipio,
          data.municipioId,
          data.correo
        ]
      );
      return res;
    } catch (err) {
      console.error('Error insertando usuario:', err);
      throw err;
    }
  }

  public async getUsuarios(): Promise<capSQLiteValues> {
    if (!this.db) {
      throw new Error('DB no inicializada. Llama a initialize() antes.');
    }
    try {
      return await this.db.query(`SELECT * FROM usuario;`);
    } catch (err) {
      console.error('Error consultando usuarios:', err);
      throw err;
    }
  }

  public async findUsuarioByCorreo(correo: string): Promise<capSQLiteValues> {
    if (!this.db) {
      throw new Error('DB no inicializada. Llama a initialize() antes.');
    }
    try {
      // Consulta parametrizada para evitar SQL injection
      const res = await this.db.query(
        `SELECT * FROM usuario WHERE correo = ?;`,
        [correo]
      );
      return res;
    } catch (err) {
      console.error('Error buscando usuario por correo:', err);
      throw err;
    }
  }

  public async close(): Promise<void> {
    if (this.db) {
      try {
        await this.sqlite.closeConnection(this.DB_NAME, false);
        console.log('SQLite: conexión cerrada');
      } catch (err) {
        console.warn('Error cerrando conexión SQLite:', err);
      }
      this.db = null;
    }
  }
}
