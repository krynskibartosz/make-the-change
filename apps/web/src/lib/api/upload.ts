/**
 * Uploads a single file for a product.
 * @param file The file to upload.
 * @param productId (Optional) The ID of the product.
 * @returns The result of the upload API call (URL or updated images list).
 */
export async function uploadProductImage(file: File, productId?: string) {
  const formData = new FormData()
  formData.append('file', file)

  if (productId) {
    formData.append('productId', productId)
  }

  const response = await fetch('/api/upload/product-images', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Upload failed: ${response.status} - ${errorText}`)
  }

  return response.json()
}

/**
 * Uploads a single file for a project.
 * @param file The file to upload.
 * @param projectId (Optional) The ID of the project.
 * @returns The result of the upload API call (URL or updated images list).
 */
export async function uploadProjectImage(file: File, projectId?: string) {
  const formData = new FormData()
  formData.append('file', file)

  if (projectId) {
    formData.append('projectId', projectId)
  }

  const response = await fetch('/api/upload/project-images', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Upload failed: ${response.status} - ${errorText}`)
  }

  return response.json()
}
