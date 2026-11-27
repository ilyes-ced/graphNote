//* true=succefully copied, string=error message
export default async (
	fileData: { name: string; data: Uint8Array; type: string }
): Promise<{ success: boolean; path: string }> => {
	try {
		console.log(fileData)
		const result = await window.api.writeFile({ name: fileData.name, data: fileData.data, fileType: fileData.type })
		return result
	} catch (error) {
		console.error("Error saving the node file:", error)
		return { success: false, path: "" }
	}
}
