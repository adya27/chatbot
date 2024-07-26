import React from "react";
import ChatBot from "react-chatbotify";
import { data } from "../data";

const MyChatBot = () => {
  const [form, setForm] = React.useState({});
  const stockArray = data.map((stock) => stock.stockExchange);

  const getTopStocksArray = (currentStock) => {
    console.log(currentStock);
    const topStocks = data.filter(
      (stock) => stock.stockExchange === currentStock
    );
    if (topStocks.length) {
      return topStocks[0].topStocks.map((stock) => stock.stockName);
    }
  };

  const getTopStocks = (currentStock) => {
    console.log(currentStock);
    const topStocks = data.filter(
      (stock) => stock.stockExchange === currentStock
    );
    if (topStocks.length) {
      return topStocks[0].topStocks;
    }
  };

  const getPrice = (topStock) => {
    const topStockObj = form.topStocks.filter(
      (stock) => stock.stockName === topStock
    );
    if (topStockObj[0].price) {
      return topStockObj[0].price;
    } else {
      throw new Error("No price found");
    }
  };

  const flow = {
    start: {
      message: "Hello! Welcome to LSEG. I'm here to help you.",
      transition: { duration: 1000 },
      path: "show_options",
    },
    show_options: {
      message: "Please select a Stock Exchange.",
      options: stockArray,
      function: (params) =>
        setForm({
          ...form,
          topStocksArray: getTopStocksArray(params.userInput),
          topStocks: getTopStocks(params.userInput),
          stockExchange: params.userInput,
        }),
      path: "process_stocks",
    },
    prompt_again: {
      message: "Do you need any other help?",
      options: stockArray,
      path: () => {
        return "process_stocks";
      },
    },
    unknown_input: {
      message:
        "Sorry, I do not understand your message 😢! If you require further assistance, you may click on " +
        "the Github option and open an issue there or visit our discord.",
      options: stockArray,
      path: () => {
        return "process_stocks";
      },
    },
    process_stocks: {
      message: "Please select a stock",
      options: form.topStocksArray,
      function: (params) =>
        setForm({ ...form, stockPrice: getPrice(params.userInput) }),
      path: "process_price",
    },

    process_price: {
      message: `Stock price ${form.stockPrice}`,
      transition: { duration: 3000 },
      path: "show_options",
    },

    process_options: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params) => {
        let link = "";
        switch (params.userInput) {
          case stockArray[0]:
            link =
              "https://react-chatbotify.tjtanjin.com/docs/introduction/quickstart/";
            break;
          case stockArray[1]:
            link = "https://react-chatbotify.tjtanjin.com/docs/api/bot_options";
            break;
          case stockArray[2]:
            link =
              "https://react-chatbotify.tjtanjin.com/docs/examples/basic_form";
            break;
          default:
            return "unknown_input";
        }
        await params.injectMessage("Sit tight! I'll send you right there!");
        setTimeout(() => {
          window.open(link);
        }, 1000);
        return "repeat";
      },
    },
    repeat: {
      transition: { duration: 3000 },
      path: "prompt_again",
    },
  };
  return (
    <ChatBot
      options={{
        // theme: { embedded: true },
        chatHistory: { storageKey: "example_faq_bot" },
      }}
      flow={flow}
    />
  );
};

export default MyChatBot;
