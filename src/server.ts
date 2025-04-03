import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context.mjs';

const angularAppEngine = new AngularAppEngine();

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext();

  // Ajouter ici vos endpoints API personnalisés si nécessaire.
  const pathname = new URL(request.url).pathname;
  if (pathname === '/api/hello') {
    return new Response(JSON.stringify({ message: 'Hello from the API' }), { status: 200 });
  }

  try {
    const result = await angularAppEngine.handle(request, context);
    return result || new Response('Not found', { status: 404 });
  } catch (error) {
    console.error('Erreur lors de la gestion de la requête :', error);
    return new Response('Erreur interne du serveur', { status: 500 });
  }
}

/**
 * Le gestionnaire de requêtes utilisé par Angular CLI (dev-server et lors de la construction).
 */
export const handler = createRequestHandler(netlifyAppEngineHandler);
