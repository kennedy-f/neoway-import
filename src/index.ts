import { TypeormDataSource } from './config/db';
import { ImportService } from './modules/import';
import { StoreService } from './modules/store';
import { UserService } from './modules/user';
import { RepoService } from './repository';
import { TicketService } from './modules/ticket';

TypeormDataSource.initialize().then(() => {
  // Injeto as dependencias.
  // Poderia criar um encapsulador e apenas importar todos já com o repo
  // porem por ter poucos optei por deixalos aqui na inicialização da aplicação
  const repoService = new RepoService();
  const storeService = new StoreService(repoService);
  const userService = new UserService(repoService);
  const ticketService = new TicketService(repoService);

  // sempre que rodar o teste vai limpar o banco
  TypeormDataSource.query(
    'TRUNCATE "public"."store" RESTART IDENTITY CASCADE;\n' +
      'TRUNCATE "public"."user" RESTART IDENTITY CASCADE;',
  ).then(async () => {
    await new ImportService(
      storeService,
      userService,
      ticketService,
    ).importLocalFile();
    await TypeormDataSource.destroy();
  });
});
