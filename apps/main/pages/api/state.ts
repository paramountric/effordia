import type {NextApiRequest, NextApiResponse} from 'next';

async function handleState(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  if (!res.socket) {
    console.log('no socket');
    res.status(500).end();
    return;
  }

  try {
    // @ts-ignore
    res.socket.server.io.emit('set-data', req.query);
    res.status(200).json({
      test: 'test2',
    });
  } catch (err) {
    console.log(err);
    res.status(401).end();
  }
}

export default handleState;
