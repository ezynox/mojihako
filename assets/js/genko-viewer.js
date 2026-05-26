(function () {
    const root = document.querySelector("[data-genko-tool]");
    if (!root) return;

    const i18n = window.MojiHakoI18n;
    const uiText = (key, params) => i18n ? i18n.t(key, params) : key;

    const input = root.querySelector("[data-genko-input]");
    const fileInput = root.querySelector("[data-genko-file]");
    const fileStatus = root.querySelector("[data-genko-file-status]");
    const viewer = document.querySelector("[data-genko-viewer]");
    const pager = document.querySelector("[data-genko-pager]");
    const pageInput = document.querySelector("[data-genko-page-input]");
    const totalPageControl = document.querySelector("[data-genko-total-pages-control]");
    const statOutputs = {
        total: document.querySelector('[data-genko-stat="total"]'),
        noSpaces: document.querySelector('[data-genko-stat="noSpaces"]'),
        lines: document.querySelector('[data-genko-stat="lines"]'),
        rawSheets: document.querySelector('[data-genko-stat="rawSheets"]'),
        layoutSheets: document.querySelector('[data-genko-stat="layoutSheets"]'),
    };

    const closingPunctuation = new Set(Array.from("。、，．.,！？!?」』】〉》〕）］｝)]}"));
    const smallPunctuation = new Set(Array.from("、。，．,."));
    const japaneseSmallPunctuation = new Set(Array.from("。、"));
    const openingBrackets = new Set(Array.from("「『（([{｛〔［〈《【"));
    const verticalAsciiBrackets = new Set(Array.from("()[]{}"));
    const quoteMarks = new Set(["'", "\"", "“", "”", "‘", "’"]);
    const openingQuoteMarks = new Set(["“", "‘"]);
    const closingQuoteMarks = new Set(["”", "’"]);
    const koreanSentenceSpacingPunctuation = new Set(["!", "?", "！", "？"]);
    const koreanTightPunctuation = new Set([".", ",", "．", "，"]);
    const sharedCellPunctuation = new Set(["、", "。", "，", "．", ",", ".", "!", "?", "！", "？"]);

    const state = {
        pageIndex: 0,
        layout: null,
    };

    function selectedValue(name, fallback) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : fallback;
    }

    function checked(selector) {
        const checkbox = root.querySelector(selector);
        return checkbox ? checkbox.checked : false;
    }

    function paperConfig() {
        const paper = selectedValue("genko-paper", "400");
        if (paper === "200") {
            return { paper, rows: 20, columns: 10, pageSize: 200 };
        }
        return { paper: "400", rows: 20, columns: 20, pageSize: 400 };
    }

    function readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(String(reader.result || "")));
            reader.addEventListener("error", () => reject(reader.error || new Error("file read failed")));
            reader.readAsText(file, "utf-8");
        });
    }

    function transferredText() {
        const params = new URLSearchParams(window.location.search);
        return params.has("text") ? params.get("text") : null;
    }

    function sourceText(source) {
        if (!source) return "";
        if ("value" in source) return source.value;
        return source.textContent || "";
    }

    function updateHandoffLinks() {
        document.querySelectorAll("[data-handoff-source]").forEach((group) => {
            const source = document.getElementById(group.dataset.handoffSource);
            const text = sourceText(source);
            group.querySelectorAll("[data-handoff-target]").forEach((link) => {
                const target = link.dataset.handoffTarget;
                link.href = text ? `${target}?text=${encodeURIComponent(text)}` : target;
            });
        });
    }

    function normalizeLineEndings(text) {
        return String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    }

    function isBlankLine(line) {
        return line.replace(/[ \t\u3000]/g, "") === "";
    }

    function removeBlankLines(text) {
        return text.split("\n").filter((line) => !isBlankLine(line)).join("\n");
    }

    function removeParagraphLeadingWhitespace(text) {
        return text.split("\n").map((line) => {
            if (isBlankLine(line)) return line;
            return line.replace(/^[ \t\u3000]+/, "");
        }).join("\n");
    }

    function prepareTextForLayout(text, options) {
        let prepared = normalizeLineEndings(text);
        if (options.removeBlankLines) prepared = removeBlankLines(prepared);
        if (options.indentParagraph) prepared = removeParagraphLeadingWhitespace(prepared);
        prepared = prepared.replace(/\t/g, "　　");
        prepared = prepared.replace(/\.{3}/g, "…");
        return applyKoreanPunctuationSpacing(prepared);
    }

    function countCharacters(text) {
        const textWithoutLineBreaks = text.replace(/\n/g, "");
        return {
            total: Array.from(textWithoutLineBreaks).length,
            noSpaces: Array.from(textWithoutLineBreaks.replace(/[ \u3000]/g, "")).length,
            lines: text.length ? text.split("\n").length : 0,
        };
    }

    function isAsciiPairCharacter(char) {
        return /^[A-Za-z0-9]$/.test(char);
    }

    function isAsciiLetter(char) {
        return /^[A-Za-z]$/.test(char);
    }

    function isHangulCharacter(char) {
        return /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/.test(char);
    }

    function isWhitespaceCharacter(char) {
        return char === " " || char === "　" || char === "\t";
    }

    function previousMeaningfulCharacter(chars, startIndex) {
        for (let index = startIndex; index >= 0; index -= 1) {
            const char = chars[index];
            if (char === "\n" || isWhitespaceCharacter(char)) continue;
            return char;
        }
        return "";
    }

    function nextMeaningfulCharacter(chars, startIndex) {
        for (let index = startIndex; index < chars.length; index += 1) {
            const char = chars[index];
            if (char === "\n" || isWhitespaceCharacter(char)) continue;
            return char;
        }
        return "";
    }

    function isSpacedSingleLetterApostrophe(chars, index) {
        const previousChar = chars[index - 1] || "";
        const nextChar = chars[index + 1] || "";

        if (nextChar.toLowerCase() === "n" && chars[index + 2] === "'") {
            const previousWordChar = previousMeaningfulCharacter(chars, index - 1);
            const nextWordChar = nextMeaningfulCharacter(chars, index + 3);
            return isAsciiLetter(previousWordChar) && isAsciiLetter(nextWordChar);
        }

        if (previousChar.toLowerCase() === "n" && chars[index - 2] === "'") {
            const previousWordChar = previousMeaningfulCharacter(chars, index - 3);
            const nextWordChar = nextMeaningfulCharacter(chars, index + 1);
            return isAsciiLetter(previousWordChar) && isAsciiLetter(nextWordChar);
        }

        return false;
    }

    function isApostrophe(chars, index) {
        if (chars[index] !== "'") return false;
        const previousChar = chars[index - 1] || "";
        const nextChar = chars[index + 1] || "";
        return (isAsciiLetter(previousChar) && isAsciiLetter(nextChar)) ||
            isSpacedSingleLetterApostrophe(chars, index);
    }

    function quoteType(char, chars, index, quoteState) {
        if (openingQuoteMarks.has(char)) return "quote";
        if (closingQuoteMarks.has(char)) return "closing";

        if (char === "\"") {
            const type = quoteState.double ? "closing" : "quote";
            quoteState.double = !quoteState.double;
            return type;
        }

        if (char === "'") {
            if (isApostrophe(chars, index)) return null;
            const type = quoteState.single ? "closing" : "quote";
            quoteState.single = !quoteState.single;
            return type;
        }

        return null;
    }

    function applyKoreanPunctuationSpacing(text) {
        const chars = Array.from(text);
        const normalized = [];

        for (let index = 0; index < chars.length; index += 1) {
            const char = chars[index];
            normalized.push(char);

            if (!koreanSentenceSpacingPunctuation.has(char) && !koreanTightPunctuation.has(char)) continue;

            const previousChar = previousMeaningfulCharacter(chars, index - 1);
            const nextChar = nextMeaningfulCharacter(chars, index + 1);
            if (!isHangulCharacter(previousChar) || !isHangulCharacter(nextChar)) continue;

            let lookahead = index + 1;
            if ((chars[lookahead] || "") === "\n") continue;

            while (isWhitespaceCharacter(chars[lookahead] || "")) {
                lookahead += 1;
            }

            if ((chars[lookahead] || "") === "\n") continue;
            if (lookahead > index + 1) index = lookahead - 1;
            if (koreanSentenceSpacingPunctuation.has(char)) normalized.push(" ");
        }

        return normalized.join("");
    }

    function tokenType(char) {
        if (smallPunctuation.has(char)) return "punctuation";
        if (closingPunctuation.has(char)) return "closing";
        if (char === " " || char === "　") return "space";
        if (verticalAsciiBrackets.has(char)) return "bracket";
        return "normal";
    }

    function buildTokens(text) {
        const chars = Array.from(text);
        const tokens = [];
        const quoteState = {
            double: false,
            single: false,
        };
        let index = 0;

        while (index < chars.length) {
            const char = chars[index];
            if (char === "\n") {
                tokens.push({ type: "newline", text: "\n" });
                index += 1;
                continue;
            }

            if (isAsciiPairCharacter(char)) {
                let run = "";
                while (index < chars.length && isAsciiPairCharacter(chars[index])) {
                    run += chars[index];
                    index += 1;
                }
                for (let runIndex = 0; runIndex < run.length; runIndex += 2) {
                    tokens.push({ type: "ascii", text: run.slice(runIndex, runIndex + 2) });
                }
                continue;
            }

            const previousChar = previousMeaningfulCharacter(chars, index - 1);
            const type = quoteMarks.has(char)
                ? (quoteType(char, chars, index, quoteState) || tokenType(char))
                : tokenType(char);

            tokens.push({
                type,
                text: char === " " ? "　" : char,
                attachToPrevious: type === "closing" &&
                    quoteMarks.has(char) &&
                    sharedCellPunctuation.has(previousChar),
            });
            index += 1;
        }

        return tokens;
    }

    function emptyCell(reason) {
        return { type: "blank", text: "", reason };
    }

    function shouldIndentParagraph(firstToken) {
        if (!firstToken) return false;
        if (firstToken.type === "quote") return false;
        if (openingBrackets.has(firstToken.text)) return false;
        return true;
    }

    function layoutTokens(tokens, options) {
        const { rows, columns, pageSize } = options;
        const cells = [];
        let cellIndex = 0;
        let lastPlacedIndex = -1;
        let paragraphStart = true;

        function placeBlank(reason) {
            cells[cellIndex] = emptyCell(reason);
            cellIndex += 1;
        }

        function advanceToNextColumn() {
            const row = cellIndex % rows;
            const advance = row === 0 ? rows : rows - row;
            for (let count = 0; count < advance; count += 1) placeBlank("linebreak");
        }

        function attachToPreviousCell(token, forceHanging = false) {
            if (lastPlacedIndex < 0 || !cells[lastPlacedIndex]) return false;
            const cell = cells[lastPlacedIndex];
            const hasHangingMarks = (cell.marks || []).some((mark) => mark.hanging);
            cell.marks = cell.marks || [];
            cell.marks.push({
                hanging: forceHanging || hasHangingMarks,
                text: token.text,
                type: token.type,
            });
            return true;
        }

        function placeToken(token) {
            if (token.attachToPrevious && attachToPreviousCell(token)) {
                return;
            }

            if (
                options.kinsoku &&
                (token.type === "punctuation" || token.type === "closing") &&
                cellIndex % rows === 0 &&
                attachToPreviousCell(token, true)
            ) {
                return;
            }

            cells[cellIndex] = { ...token };
            lastPlacedIndex = cellIndex;
            cellIndex += 1;
        }

        tokens.forEach((token) => {
            if (token.type === "newline") {
                if (options.respectLineBreaks) {
                    advanceToNextColumn();
                    paragraphStart = true;
                } else {
                    placeToken({ type: "space", text: "　" });
                }
                return;
            }

            if (token.type === "space" && paragraphStart && cellIndex % rows === 0) return;

            if (options.indentParagraph && paragraphStart && shouldIndentParagraph(token)) {
                placeBlank("indent");
            }
            paragraphStart = false;
            if (token.type === "space" && cellIndex % rows === 0) return;
            placeToken(token);
        });

        const usedLength = cellIndex;
        const filledPageCount = usedLength ? Math.ceil(usedLength / pageSize) : 0;
        const renderPageCount = Math.max(1, filledPageCount);
        const pages = [];
        for (let pageIndex = 0; pageIndex < renderPageCount; pageIndex += 1) {
            pages.push(cells.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
        }

        return {
            cells,
            columns,
            filledPageCount,
            pageSize,
            pages,
            rows,
            usedLength,
        };
    }

    function paginateCells(cells, pageSize) {
        const pages = [];
        for (let index = 0; index < cells.length; index += pageSize) {
            pages.push(cells.slice(index, index + pageSize));
        }
        return pages;
    }

    function getOptions() {
        return {
            ...paperConfig(),
            viewMode: selectedValue("genko-view-mode", "paged"),
            showGrid: checked("[data-genko-grid-toggle]"),
            indentParagraph: checked("[data-genko-indent]"),
            removeBlankLines: checked("[data-genko-remove-blank-lines]"),
            respectLineBreaks: checked("[data-genko-linebreaks]"),
            kinsoku: checked("[data-genko-kinsoku]"),
        };
    }

    function formatNumber(value) {
        return new Intl.NumberFormat(i18n ? i18n.lang : "ko").format(value);
    }

    function formatUnit(key, numericValue, formattedValue = formatNumber(numericValue)) {
        const unitKey = Math.abs(numericValue) === 1 ? `${key}One` : key;
        return uiText(unitKey, { value: formattedValue });
    }

    function formatSheet(value) {
        if (!value) return formatUnit("genko.sheetUnit", 0, "0");
        const rounded = Math.ceil(value * 10) / 10;
        return formatUnit("genko.sheetUnit", rounded, rounded.toFixed(rounded % 1 === 0 ? 0 : 1));
    }

    function renderStats(stats, layout, options) {
        const rawSheetValue = stats.total / options.pageSize;
        if (statOutputs.total) statOutputs.total.textContent = formatUnit("genko.characterUnit", stats.total);
        if (statOutputs.noSpaces) statOutputs.noSpaces.textContent = formatUnit("genko.characterUnit", stats.noSpaces);
        if (statOutputs.lines) statOutputs.lines.textContent = formatUnit("genko.lineUnit", stats.lines);
        if (statOutputs.rawSheets) statOutputs.rawSheets.textContent = formatSheet(rawSheetValue);
        if (statOutputs.layoutSheets) statOutputs.layoutSheets.textContent = formatUnit("genko.sheetUnit", layout.filledPageCount);
    }

    function createTokenElement(cell) {
        const token = document.createElement("span");
        token.className = `genko-token genko-token-${cell.type}`;
        if (smallPunctuation.has(cell.text)) token.classList.add("genko-token-punctuation");
        if (japaneseSmallPunctuation.has(cell.text)) token.classList.add("genko-token-japanese-punctuation");
        if (verticalAsciiBrackets.has(cell.text)) token.classList.add("genko-token-bracket");
        if ((cell.type === "quote" || cell.type === "closing") && quoteMarks.has(cell.text)) token.classList.add("genko-token-quote");
        token.textContent = cell.text;
        return token;
    }

    function markClassName(mark) {
        const classes = ["genko-cell-mark"];

        if (mark.hanging) classes.push("genko-cell-mark-hanging");
        if (mark.type === "closing") classes.push("genko-cell-mark-closing");
        if (smallPunctuation.has(mark.text)) classes.push("genko-cell-mark-punctuation", "genko-token-punctuation");
        if (japaneseSmallPunctuation.has(mark.text)) classes.push("genko-cell-mark-japanese-punctuation", "genko-token-japanese-punctuation");
        if (verticalAsciiBrackets.has(mark.text)) classes.push("genko-token-bracket");
        if ((mark.type === "quote" || mark.type === "closing") && quoteMarks.has(mark.text)) {
            classes.push("genko-cell-mark-quote", "genko-token-quote");
        }

        return classes.join(" ");
    }

    function createCellElement(cell, cellNumber, layout, options) {
        const row = cellNumber % layout.rows;
        const column = Math.floor(cellNumber / layout.rows);
        const element = document.createElement("div");
        element.className = "genko-cell";
        element.style.gridRow = String(row + 1);
        element.style.gridColumn = String(layout.columns - column);

        if (cell && cell.text) {
            element.appendChild(createTokenElement(cell));
        }

        if (cell && cell.marks) {
            cell.marks.forEach((mark, markIndex) => {
                const markElement = document.createElement("span");
                markElement.className = markClassName(mark);
                markElement.style.setProperty("--genko-mark-offset", `${markIndex * 0.48}em`);
                markElement.textContent = mark.text;
                element.appendChild(markElement);
            });
        }

        if (!options.showGrid) element.classList.add("is-borderless");
        return element;
    }

    function createPageElement(pageCells, pageIndex, layout, options) {
        const paper = document.createElement("article");
        paper.className = "genko-paper";
        paper.setAttribute("aria-label", uiText("genko.pageLabel", {
            current: pageIndex + 1,
            total: layout.pages.length,
        }));

        const pageTitle = document.createElement("div");
        pageTitle.className = "genko-paper-title";
        pageTitle.textContent = uiText("genko.pageLabel", {
            current: pageIndex + 1,
            total: layout.pages.length,
        });

        const grid = document.createElement("div");
        grid.className = `genko-grid${options.showGrid ? "" : " is-grid-hidden"}`;
        grid.style.setProperty("--genko-rows", String(layout.rows));
        grid.style.setProperty("--genko-cols", String(layout.columns));

        for (let index = 0; index < layout.pageSize; index += 1) {
            grid.appendChild(createCellElement(pageCells[index], index, layout, options));
        }

        paper.append(pageTitle, grid);
        return paper;
    }

    function renderPage(pageIndex) {
        if (!viewer || !state.layout) return;
        const options = getOptions();
        const index = Math.min(Math.max(pageIndex, 0), state.layout.pages.length - 1);
        const page = state.layout.pages[index] || [];
        viewer.replaceChildren(createPageElement(page, index, state.layout, options));
    }

    function renderAllPages() {
        if (!viewer || !state.layout) return;
        const options = getOptions();
        const stack = document.createElement("div");
        stack.className = "genko-page-stack";
        state.layout.pages.forEach((page, index) => {
            stack.appendChild(createPageElement(page, index, state.layout, options));
        });
        viewer.replaceChildren(stack);
    }

    function syncPager(layout, options) {
        const totalPages = layout.pages.length;
        state.pageIndex = Math.min(Math.max(state.pageIndex, 0), totalPages - 1);
        const current = state.pageIndex + 1;

        if (totalPageControl) totalPageControl.textContent = formatNumber(totalPages);
        if (pageInput) {
            pageInput.value = String(current);
            pageInput.max = String(totalPages);
        }
        if (pager) pager.hidden = options.viewMode === "all";

        document.querySelectorAll("[data-genko-action]").forEach((button) => {
            const action = button.dataset.genkoAction;
            const atFirst = state.pageIndex <= 0;
            const atLast = state.pageIndex >= totalPages - 1;
            button.disabled = options.viewMode === "all" ||
                ((action === "first" || action === "prev") && atFirst) ||
                ((action === "next" || action === "last") && atLast);
        });
    }

    function updateView() {
        const options = getOptions();
        const text = prepareTextForLayout(input ? input.value : "", options);
        const stats = countCharacters(text);
        const tokens = buildTokens(text, options);
        const layout = layoutTokens(tokens, options);
        layout.pages = paginateCells(layout.cells, layout.pageSize);
        if (!layout.pages.length) layout.pages = [Array(layout.pageSize).fill(null)];
        state.layout = layout;

        renderStats(stats, layout, options);
        syncPager(layout, options);
        if (options.viewMode === "all") renderAllPages();
        else renderPage(state.pageIndex);
        updateHandoffLinks();
    }

    function goToPage(pageIndex) {
        if (!state.layout) return;
        state.pageIndex = Math.min(Math.max(pageIndex, 0), state.layout.pages.length - 1);
        updateView();
    }

    if (input) input.addEventListener("input", updateView);

    if (fileInput) {
        fileInput.addEventListener("change", () => {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;
            readTextFile(file).then((text) => {
                input.value = normalizeLineEndings(text);
                if (fileStatus) fileStatus.textContent = uiText("genko.fileLoaded", { name: file.name });
                state.pageIndex = 0;
                updateView();
            }).catch(() => {
                if (fileStatus) fileStatus.textContent = uiText("genko.fileError");
            });
        });
    }

    root.querySelectorAll('input[name="genko-paper"], input[name="genko-view-mode"], [data-genko-grid-toggle], [data-genko-indent], [data-genko-remove-blank-lines], [data-genko-linebreaks], [data-genko-kinsoku]').forEach((control) => {
        control.addEventListener("change", () => {
            state.pageIndex = 0;
            updateView();
        });
    });

    document.querySelectorAll("[data-genko-action]").forEach((button) => {
        button.addEventListener("click", () => {
            if (!state.layout) return;
            const lastPageIndex = state.layout.pages.length - 1;
            switch (button.dataset.genkoAction) {
            case "first":
                goToPage(0);
                break;
            case "prev":
                goToPage(state.pageIndex - 1);
                break;
            case "next":
                goToPage(state.pageIndex + 1);
                break;
            case "last":
                goToPage(lastPageIndex);
                break;
            case "go":
                goToPage(Number(pageInput.value || 1) - 1);
                break;
            default:
                break;
            }
        });
    });

    if (pageInput) {
        pageInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                goToPage(Number(pageInput.value || 1) - 1);
            }
        });
    }

    const incomingText = transferredText();
    if (incomingText !== null && input) input.value = normalizeLineEndings(incomingText);

    updateView();
}());
