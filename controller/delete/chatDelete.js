const { chatModal } = require('../connection')
exports.deleteChat = (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    const getOperation = async () => {
        const { chat_id } = req.query
        const result = await chatModal.deleteOne({ chatID: chat_id })
        if (result.deletedCount === 1) {
            res.send({
                status: true,
                count: result.deletedCount,
                massage: "delete chat success..."
            })
        } else {
            res.send({
                status: false,
                count: result.deletedCount,
                massage: "try again"
            })
        }
    }
    getOperation()
}