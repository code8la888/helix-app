const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "輸入內容不可包含 HTML 或 JavaScript 程式碼!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.mouseSchema = Joi.object({
  mouse: Joi.object({
    no: Joi.string()
      .pattern(/^[FM][1-9][0-9]{0,2}$/)
      .required(),
    strain: Joi.string()
      .pattern(/^[a-fA-F0-9]{24}$/)
      .required()
      .escapeHTML(),
    toeNumber: Joi.string().allow("").optional().escapeHTML(),
    birth_date: Joi.date().required(),
    gender: Joi.string().valid("F", "M").required(),
    parents: Joi.object({
      father: Joi.string().required().escapeHTML(),
      mother: Joi.string().required().escapeHTML(),
    }).required(),
    sampling_date: Joi.date().allow("").optional(),
    exit_date: Joi.date().allow("", null).optional(),
    sampling_results: Joi.array()
      .items(Joi.string().valid("WT", "HT", "KO", "檢測中"))
      .optional(),
    litter: Joi.number().required().min(1),
    on_shelf: Joi.string()
      .valid("在架上", "已移出", "已犧牲", "自然死亡")
      .required(),
    note: Joi.string().allow("").optional().escapeHTML(),
  }).required(),
});

module.exports.strainSchema = Joi.object({
  strain: Joi.object({
    strain: Joi.string().required().escapeHTML(),
    abbr: Joi.string().required().escapeHTML(),
    iacuc_no: Joi.string().required().escapeHTML(),
    dept: Joi.string().required().escapeHTML(),
    EXP: Joi.date().required(),
    users: Joi.array().items(Joi.string().escapeHTML()).optional(),
    genes: Joi.array().items(Joi.string().escapeHTML()).optional(),
    mice: Joi.array()
      .items(
        Joi.string()
          .pattern(/^[a-fA-F0-9]{24}$/)
          .escapeHTML()
      )
      .optional(),
    breedingRecords: Joi.array()
      .items(
        Joi.string()
          .pattern(/^[a-fA-F0-9]{24}$/)
          .escapeHTML()
      )
      .optional(),
    _id: Joi.string()
      .pattern(/^[a-fA-F0-9]/)
      .optional(),
  }).required(),
  deleteUsers: Joi.array().items(Joi.string().escapeHTML()).optional(),
  newUsers: Joi.array().items(Joi.string().escapeHTML()).optional(),
});

module.exports.breedingRecordSchema = Joi.object({
  breedingRecord: Joi.object({
    strain: Joi.string()
      .pattern(/^[a-fA-F0-9]{24}$/)
      .required(),
    cage_no: Joi.string().required(),
    parents: Joi.object({
      father: Joi.string().required().escapeHTML(),
      mother: Joi.string().required().escapeHTML(),
    }),
    pairing_date: Joi.date().required(),
    offspring: Joi.string()
      .pattern(/^[a-fA-F0-9]/)
      .optional(),
    on_shelf: Joi.string().valid("在架上", "已關閉").required(),
  }),
});

module.exports.userSchema = Joi.object({
  _id: Joi.string()
    .pattern(/^[a-fA-F0-9]/)
    .optional(),
  username: Joi.string().email().optional().escapeHTML(), //帳號信箱
  name: Joi.string().min(2).max(20).optional().escapeHTML(),
  role: Joi.string().valid("委託人", "計畫管理人", "獸醫").required(),
  tel: Joi.string().required().escapeHTML(),
  dept: Joi.string().min(2).max(15).required().escapeHTML(),
  password: Joi.string().optional(),
  googleId: Joi.string().allow("", null), //允許空值(一般註冊)
});
