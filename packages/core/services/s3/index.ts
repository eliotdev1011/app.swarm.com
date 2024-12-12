import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity'

const BUCKET_NAME = 'sof-verifications'
const REGION = 'eu-central-1'
const IDENTITY_POOL_ID = 'eu-central-1:dd13d047-e736-4731-a05e-5c2b8cc79f73'

const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: IDENTITY_POOL_ID,
  }),
})

const uploadFileToS3 = async (file: File): Promise<string> => {
  try {
    const guid = crypto.randomUUID()
    const extension = String(file.name.split('.').splice(-1)[0]).toLowerCase()
    const fileKey = `${guid}.${extension}`
    const uploadResponse = await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: file,
      }),
    )

    if (uploadResponse.$metadata.httpStatusCode === 200) {
      const fileURL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`
      return fileURL
    }
    return ''
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('An error occurred while uploading image', error)
    return ''
  }
}

export { uploadFileToS3 }
