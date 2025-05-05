async function googleDocToHTML(googleDocResponse) {
	const googleDoc = [];
	if ("data" in googleDocResponse) {
		if ("body" in googleDocResponse.data) {
			if ("content" in googleDocResponse.data.body) {
				const data = googleDocResponse.data.body.content;
				let listTag = '';
				for await (const [index, element] of data.entries()) {
					const next = data[index + 1];

					let parentTag = "span";
					let parentHTMLClass = "";
					if ("paragraph" in element) {
						if ("paragraphStyle" in element.paragraph) {
							// console.log("parent_styles" + index + ":", element.paragraph.paragraphStyle);
							let parentHTMLClasses = "";
							if ("alignment" in element.paragraph.paragraphStyle) {
								parentHTMLClasses += element.paragraph.paragraphStyle.alignment.toLowerCase() + " ";
							}
							if (parentHTMLClasses) {
								parentHTMLClass = ' class="' + parentHTMLClasses.trim() + '"';
							}

							if ("namedStyleType" in element.paragraph.paragraphStyle) {
								switch (element.paragraph.paragraphStyle.namedStyleType) {
									case "NORMAL_TEXT":
										parentTag = "p";
										if ("bullet" in element.paragraph) {
											parentTag = "li";
										}
										break;
									case "HEADING_1":
										parentTag = "h1";
										break;
									case "HEADING_2":
										parentTag = "h2";
										break;
									case "HEADING_3":
										parentTag = "h3";
										break;
									case "HEADING_4":
										parentTag = "h4";
										break;
									case "HEADING_5":
										parentTag = "h5";
										break;
									case "HEADING_6":
										parentTag = "h6";
										break;
								}
							}
						}
					}

					if ("paragraph" in element) {
						if (element.paragraph.elements) {
							let childContent = "";
							if (element.paragraph.elements[0]) {
								if ("textRun" in element.paragraph.elements[0]) {
									if ("content" in element.paragraph.elements[0].textRun) {
										childContent = element.paragraph.elements[0].textRun.content.replace(/\n\t/g, "").trim();
									}
								}
							}

							if (childContent) {
								if (!listTag) {
									if (element.paragraph.bullet) {
										listTag = "ul";
										googleDoc.push("<" +listTag + ">");
									}
								}
								googleDoc.push("<" + parentTag + parentHTMLClass + ">");

								let contentArray = element.paragraph.elements;

								for await (const [contentIndex, content] of contentArray.entries()) {
									if ("textRun" in content) {
										if ("content" in content.textRun) {
											content.textRun.content = content.textRun.content.replace(/\n\t/g, "");
											if (contentIndex == 0) {
												content.textRun.content = content.textRun.content.trimStart();
											}
											if (contentIndex == contentArray.length - 1) {
												content.textRun.content = content.textRun.content.trimEnd();
											}

											if (content.textRun.content) {
												let childTag = "span";
												let childHTMLClass = "";
												let childHTMLClasses = "";
												if ("textStyle" in content.textRun) {
													//console.log("child_styles" + index + ":", content.textRun.textStyle);
													if ("bold" in content.textRun.textStyle) {
														childHTMLClasses += "bold ";
													}
													if ("italic" in content.textRun.textStyle) {
														childHTMLClasses += "italic ";
													}
													if ("underline" in content.textRun.textStyle) {
														childHTMLClasses += "underline ";
													}
													if ("fontSize" in content.textRun.textStyle) {
														if ("magnitude" in content.textRun.textStyle.fontSize) {
															childHTMLClasses += "fontSize-" + content.textRun.textStyle.fontSize.magnitude + " ";
														}
														if ("weight" in content.textRun.textStyle.fontSize) {
															childHTMLClasses += "fontWeight-" + content.textRun.textStyle.fontSize.weight + " ";
														}
													}
												}
												if (childHTMLClasses) {
													childHTMLClass = ' class="' + childHTMLClasses.trim() + '"';
												}

												// console.log("content" + index + ":", content.textRun.content);

												content.textRun.content = "<" + childTag + childHTMLClass + ">" + content.textRun.content + "</" + childTag + ">";
												googleDoc.push(content.textRun.content);
											}
										}
									} else {
										if ("horizontalRule" in content) {
											googleDoc.push("<hr>");
										}
									}
								}

								googleDoc.push("</" + parentTag + ">");
							}

							if (listTag) {
								let endList = false;
								if (next) {
									if (next.paragraph.bullet) {
										endList = false;
									} else {
										endList = true;
									}
								} else {
									endList = true;
								}
								if (endList == true) {
									googleDoc.push("</" + listTag + ">");
									listTag = "";
								}
							}
						}
					}
				}
			}
		}
	}
	return googleDoc;
}

export { googleDocToHTML };
