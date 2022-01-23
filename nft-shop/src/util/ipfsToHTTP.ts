export const ipfsToHttp = (ipfsURI: string) => {
  return ipfsURI.replace('ipfs://', 'https://mint.mypinata.cloud/ipfs/')
}
