/* eslint-disable */ 
export default function (dateValue) {
	return new Date(dateValue).toLocaleTimeString('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	})
}
