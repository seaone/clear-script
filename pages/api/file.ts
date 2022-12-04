// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import * as tf from '@tensorflow/tfjs-node'
import { Tensor } from '@tensorflow/tfjs-node'

type Data = {
  result: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {body} = req
  const json = JSON.parse(body)

  const fileContents = json.file.base64.replace(/^data:image\/jpeg;base64,/, "");
  let uploadedImageBuffer = Buffer.from(fileContents, 'base64');
  const originalImageBuffer = fs.readFileSync(`./public/original/${json.file.fileName}.png`);
  const [image1, image2] = imagesToTensors(uploadedImageBuffer, originalImageBuffer)
  
  try {
    const model = await tf.loadLayersModel(`file://${process.cwd()}/siamese_network/model.json`);
    const prediction = model.predict([image1, image2]) as Tensor

    const [result] = await prediction.flatten().array()

    if (result > 0.95) {
      base64ToFile(json.file)
    }

    res.status(200).json({ result: result })
  } catch(error) {
    console.error(error);
  }
}

function base64ToFile(file: { base64: string, fileName: string }) {
  const fileContents = file.base64.replace(/^data:image\/jpeg;base64,/, "");

  fs.mkdirSync(`./public/uploads/${file.fileName}`, { recursive: true });

  const fileName = `./public/uploads/${file.fileName}/${Date.now().toString()}.jpeg`

  fs.writeFile(fileName, fileContents, 'base64', (err) => {
    if (err) {
      return console.error(err);
    }
  });
}


function imagesToTensors(imageBufferA: Buffer, imageBufferB: Buffer) {
  return [imageBufferA, imageBufferB].map((buffer) => {
    const decodedImage = tf.node.decodeImage(buffer, 1)
    const resizedImage = tf.image.resizeBilinear(decodedImage, [96, 96])    
    
    return resizedImage.reshape([1, 96, 96])
  }) 
}