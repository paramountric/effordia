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

  const pageText = `You triggered: ${JSON.stringify(
    req.query,
    null,
    2
  )}\n\nExample for all color channels and elevation https://mtf.pmtric.com/api/state?id=water-2&red=0&green=255&blue=0&elevation=10\n\nColor channels should be set between 0-255, where red=0, green=0, blue=0 is black, and red=255, green=255, blue=255 is white, red=150, green=150, blue=150 is gray, etc`;

  try {
    // @ts-ignore
    res.socket.server.io.emit('set-data', req.query);
    res.status(200).send(pageText);
  } catch (err) {
    console.log(err);
    res.status(401).end();
  }
}

export default handleState;
