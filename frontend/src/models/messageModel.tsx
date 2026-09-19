
const MessageModel = (message: string) => {
  return (
    <div className=" text-black fixed top-20 ml-30 px-10 py-3 bg-white z-100 border border-black/30 rounded-md">
      {message}
    </div>
  )
}

export default MessageModel
