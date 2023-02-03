const { chatModal } = require('../connection')
exports.deleteChat = (req, res) => {
    const getOperation = async () => {
        const { chat_id } = req.query
        const result = await chatModal.deleteOne({ chat_id })
        res.send(`delete Chat ${result.deletedCount}`)
    }
    getOperation()
}