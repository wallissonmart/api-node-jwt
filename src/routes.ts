import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { UserRepository } from './repositories/UserRepository';
import { TagRepository } from './repositories/TagRepository';
import { TagController } from './controllers/TagController';
import { authMiddleware } from './middlewares/auth';
import { bindController } from './utils/bindController';

const routes = Router();

const userRepository = new UserRepository();
const userController = new UserController(userRepository);
const tagRepository = new TagRepository();
const tagController = new TagController(tagRepository);



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
