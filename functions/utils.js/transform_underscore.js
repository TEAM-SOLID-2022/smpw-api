exports.transform_underscore = (str) => {

    if (typeof str !== "string") throw new Error("str must be a string");
    str.split(" ").join("_").toLowerCase();

};