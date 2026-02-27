import Docker from 'dockerode';
import { RUNTIME_IMAGES } from './runtime-images';

const docker = new Docker();

export async function pullAllRuntimeImages() {
  const images = Object.values(RUNTIME_IMAGES);

  const pullPromises = images.map(async (image) => {
    console.log(`Pulling image: ${image}`);

    try {
      await docker.getImage(image).inspect();
      console.log(`Skipping pull. Image already exists locally: ${image}`);
      return Promise.resolve();
    } catch (error) {
      console.log(`Image not found locally, pulling: ${image}`);
    }

    return new Promise<void>((resolve, reject) => {
      docker.pull(image, (err: Error | null, stream: NodeJS.ReadableStream) => {
        if (err) return reject(err);

        docker.modem.followProgress(stream, (progressErr: Error | null) => {
          if (progressErr) return reject(err);

          console.log(`Finished pulling image: ${image}`);
          resolve();
        });
      });
    });
  });

  try {
    await Promise.all(pullPromises);
    console.log('All runtime images pulled successfully');
  } catch (error) {
    console.error('Error pulling runtime images: ', error);
  }
}
