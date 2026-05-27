//* true=succefully copied, string=error message
export default async (fileData: { name: string; data: Uint8Array; type: string }): Promise<{ res: boolean; text: string; path: string }> => {
	try {
		console.log(fileData)
		const result = await window.api.writeNodeFile({ name: fileData.name, data: fileData.data, type: fileData.type })
		return result
	} catch (error) {
		console.error('Error saving the node file:', error)
		return { res: false, text: String(error), path: '' }
	}
}
