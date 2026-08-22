import { GlobalExceptionFilter, formatStack, getErrorOrigin } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
    it('formats stack traces with file and line number details', () => {
        const error = new Error('Boom');
        error.stack = `Error: Boom\n    at UsersService.getUser (src/modules/users/providers/users.service.ts:42:17)\n    at PostController.create (src/modules/posts/posts.controller.ts:89:12)`;

        const formatted = formatStack(error);

        expect(formatted).toContain('src/modules/users/providers/users.service.ts:42:17');
        expect(formatted).toContain('src/modules/posts/posts.controller.ts:89:12');
    });

    it('extracts the controller/service method and source location from the stack trace', () => {
        const error = new Error('Boom');
        error.stack = `Error: Boom\n    at UsersService.getUser (src/modules/users/providers/users.service.ts:42:17)\n    at PostController.create (src/modules/posts/posts.controller.ts:89:12)`;

        expect(getErrorOrigin(error)).toContain('UsersService.getUser');
        expect(getErrorOrigin(error)).toContain('src/modules/users/providers/users.service.ts:42:17');
    });

    it('uses the filter name in the logger context', () => {
        expect(GlobalExceptionFilter.name).toBe('GlobalExceptionFilter');
    });
});
