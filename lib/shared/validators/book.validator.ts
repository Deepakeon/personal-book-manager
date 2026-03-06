export const bookValidationConfig = {
    titleMaxChars: 500,
    authorMaxChars: 200,
    tagMaxChars: 50,
    maxTags: 5,
};

const validateAuthor = (author: string) => {
    let error = "";

    if (!author.trim()) {
        error = "Author is required";
    } else if (author.length > bookValidationConfig.authorMaxChars) {
        error = `Author cannot exceed ${bookValidationConfig.authorMaxChars} characters`;
    }

    return error;
};

const validateTitle = (title: string) => {
    let error = "";
    if (!title.trim()) {
        error = "Title is required";
    } else if (title.length > bookValidationConfig.titleMaxChars) {
        error = `Title cannot exceed ${bookValidationConfig.titleMaxChars} characters`;
    }
    return error;
};

const validateTag = (tag: string, existingTags: string[]) => {
    const trimmed = tag.trim();
    let error = "";

   if (trimmed.length > bookValidationConfig.tagMaxChars) {
        error = `Tag cannot exceed ${bookValidationConfig.tagMaxChars} characters`;
    } else if (existingTags.length > bookValidationConfig.maxTags) {
        error = `Maximum ${bookValidationConfig.maxTags} tags allowed`;
    }

    return error;
};

export const validateBook = (
    title: string,
    author: string,
    tag: string,
    existingTags: string[],
) => {
    const errors = {
        title: "",
        author: "",
        tags: "",
    };
    errors.title = validateTitle(title);
    errors.author = validateAuthor(author);
    errors.tags = validateTag(tag, existingTags);

    return errors;
};
