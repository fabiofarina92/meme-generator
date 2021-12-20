import Jimp from "jimp";
import Enquirer from "enquirer";
import fs from "fs";
import { nanoid } from "nanoid";

async function main() {
  getMemeList().then(async (memes) => {
    const meme = await Enquirer.prompt({
      type: "select",
      name: "selected",
      message: "Pick a meme to make",
      choices: memes.map((m) => m.name),
    });

    const selectedMeme = memes.find((m) => m.name === meme.selected);
    switch (selectedMeme.type) {
      case "two_text_side":
        await generateTwoTextSide(selectedMeme);
        break;
      case "three_text":
        await generateThreeText(selectedMeme);
        break;
    }
  });
}

const getMemeList = () => {
  return new Promise((resolve, reject) => {
    fs.readdir("./templates/", (error, files) => {
      const memeList = [];
      files.forEach((file) => {
        let memeData = JSON.parse(fs.readFileSync(`./templates/${file}`));
        memeList.push(memeData);
      });
      resolve(memeList);
    });
  });
};

const getFontString = async (text) => {
  if (text.color === "white") {
    switch (text.size) {
      case 8:
        return Jimp.FONT_SANS_8_WHITE;
        break;
      case 10:
        return Jimp.FONT_SANS_10_WHITE;
        break;
      case 12:
        return Jimp.FONT_SANS_12_WHITE;
        break;
      case 14:
        return Jimp.FONT_SANS_14_WHITE;
        break;
      case 16:
        return Jimp.FONT_SANS_16_WHITE;
        break;
      case 32:
        return Jimp.FONT_SANS_32_WHITE;
        break;
      case 64:
        return Jimp.FONT_SANS_64_WHITE;
        break;
    }
  } else {
    switch (text.size) {
      case 8:
        return Jimp.FONT_SANS_8_BLACK;
        break;
      case 10:
        return Jimp.FONT_SANS_10_BLACK;
        break;
      case 12:
        return Jimp.FONT_SANS_12_BLACK;
        break;
      case 14:
        return Jimp.FONT_SANS_14_BLACK;
        break;
      case 16:
        return Jimp.FONT_SANS_16_BLACK;
        break;
      case 32:
        return Jimp.FONT_SANS_32_BLACK;
        break;
      case 64:
        return Jimp.FONT_SANS_64_BLACK;
        break;
    }
  }
};
const generateTwoTextSide = async (meme) => {
  const response = await Enquirer.prompt([
    {
      type: "input",
      name: "topText",
      message: meme.text.anchor_one.queryText,
    },
    {
      type: "input",
      name: "bottomText",
      message: meme.text.anchor_two.queryText,
    },
  ]);
  const image = await Jimp.read(meme.image);

  image.print(
    await Jimp.loadFont(await getFontString(meme.text.anchor_one)),
    meme.text.anchor_one.x,
    meme.text.anchor_one.y,
    {
      text: response.topText,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    meme.text.anchor_one.width,
    meme.text.anchor_one.height
  );
  image.print(
    await Jimp.loadFont(await getFontString(meme.text.anchor_two)),
    meme.text.anchor_two.x,
    meme.text.anchor_two.y,
    {
      text: response.bottomText,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    meme.text.anchor_two.width,
    meme.text.anchor_two.height
  );
  image.write(`output/${meme.short_name}_${nanoid(6)}.png`);
};

const generateThreeText = async (meme) => {
  const response = await Enquirer.prompt([
    {
      type: "input",
      name: "textOne",
      message: meme.text.anchor_one.queryText,
    },
    {
      type: "input",
      name: "textTwo",
      message: meme.text.anchor_two.queryText,
    },
    {
      type: "input",
      name: "textThree",
      message: meme.text.anchor_three.queryText,
    },
  ]);
  const image = await Jimp.read(meme.image);

  image.print(
    await Jimp.loadFont(await getFontString(meme.text.anchor_one)),
    meme.text.anchor_one.x,
    meme.text.anchor_one.y,
    {
      text: response.textOne,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    meme.text.anchor_one.width,
    meme.text.anchor_one.height
  );
  image.print(
    await Jimp.loadFont(await getFontString(meme.text.anchor_two)),
    meme.text.anchor_two.x,
    meme.text.anchor_two.y,
    {
      text: response.textTwo,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    meme.text.anchor_two.width,
    meme.text.anchor_two.height
  );
  image.print(
    await Jimp.loadFont(await getFontString(meme.text.anchor_three)),
    meme.text.anchor_three.x,
    meme.text.anchor_three.y,
    {
      text: response.textThree,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    meme.text.anchor_three.width,
    meme.text.anchor_three.height
  );
  image.write(`output/${meme.short_name}_${nanoid(6)}.png`);
};

await main();
