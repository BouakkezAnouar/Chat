const MessageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  date: { type: Date, default: Date.now },
  message: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 300
  }
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
