export default defineEventHandler(async (_event) => {
	const user = {
		id: '1',
		name: 'John Doe',
		email: 'john.doe@example.com',
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	return user
})
