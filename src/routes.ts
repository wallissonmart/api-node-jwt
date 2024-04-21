import { Router, Request, Response } from 'express';
import { UserController } from './controllers/UserController';
import { UserRepository } from './repositories/UserRepository';
import { TagRepository } from './repositories/TagRepository';
import { TagController } from './controllers/TagController';
import { authMiddleware } from './middlewares/auth';

const routes = Router();

const userRepository = new UserRepository();
const userController = new UserController(userRepository);
const tagRepository = new TagRepository();
const tagController = new TagController(tagRepository);

// Função de middleware para fazer o bind de req e res automaticamente
// Função de middleware para fazer o bind de req e res automaticamente
function bindController(controllerMethod: (this: any, req: Request, res: Response) => Promise<Response>) {
  return async function (this: any, req: Request, res: Response) {
    try {
      const result = await controllerMethod.call(this, req, res);
      return result;
    } catch (error) {
      // Aqui você pode lidar com erros de forma centralizada, se desejar
      console.error('Erro no middleware de rota:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
}


// Rotas públicas
routes.post('/user', bindController(userController.create));
routes.post('/login', bindController(userController.login));
routes.get('/tags', bindController(tagController.getAll));

// Middleware de autenticação
routes.use(authMiddleware);

// Rotas protegidas
routes.delete('/user', bindController(userController.delete));
routes.get('/user', bindController(userController.getById));
routes.put('/user', bindController(userController.update));
routes.get('/users', bindController(userController.getAll));

export default routes;
