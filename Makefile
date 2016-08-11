
-include config.mk	# Create and use this file to override any of 'Settings' #

# Settings #
SRC					?=	src
OUT					?=	.output

STATIC_DOMAIN		?=	static.jammer.work

# Include Folders (modified by recursive scripts) #
INCLUDE_FOLDERS		?=	$(SRC)/

# Functions (must use '=', and not ':=') #
REMOVE_UNDERSCORE	=	$(foreach v,$(1),$(if $(findstring /_,$(v)),,$(v)))
INCLUDE_INCLUDES	=	$(filter $(addsuffix %,$(dir $(INCLUDE_FOLDERS))),$(1))
FIND_FILE			=	$(call REMOVE_UNDERSCORE,$(call INCLUDE_INCLUDES,$(shell find $(1) -name '$(2)')))
# NOTE: My standard build tree rule is to ignore any file/folder prefixed with an underscore #

# Files #
ALL_JS_FILES		:=	$(filter-out %.min.js,$(call FIND_FILE,$(SRC)/,*.js))
ALL_LESS_FILES		:=	$(filter-out %.min.less,$(call FIND_FILE,$(SRC)/,*.less))
ALL_CSS_FILES		:=	$(filter-out %.min.css,$(call FIND_FILE,$(SRC)/,*.css))
ALL_SVG_FILES		:=	$(filter-out %.min.svg,$(call FIND_FILE,$(SRC)/,*.svg))

ALL_ES6IGNORE_FILES	:=	$(call FIND_FILE,$(SRC)/,.es6ignore)
ES6IGNORE_FOLDERS	:=	$(addsuffix %,$(dir $(ALL_ES6IGNORE_FILES)))

ALL_MAKEFILES		:=	$(call FIND_FILE,$(SRC)/,Makefile)

# Transforms #
ES6_FILES 			:=	$(filter-out $(ES6IGNORE_FOLDERS),$(ALL_JS_FILES))
JS_FILES 			:=	$(filter $(ES6IGNORE_FOLDERS),$(ALL_JS_FILES))
LESS_FILES			:=	$(ALL_LESS_FILES)
CSS_FILES			:=	$(ALL_CSS_FILES)
SVG_FILES			:=	$(ALL_SVG_FILES)

OUT_ES6_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(ES6_FILES:.js=.es6.js))
OUT_JS_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(JS_FILES:.js=.o.js))
OUT_LESS_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(LESS_FILES:.less=.less.css))
OUT_CSS_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(CSS_FILES:.css=.o.css))
OUT_SVG_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(SVG_FILES:.svg=.o.svg))

OUT_FILES			:=	$(OUT_ES6_FILES) $(OUT_JS_FILES) $(OUT_LESS_FILES) $(OUT_CSS_FILES) $(OUT_SVG_FILES)
DEP_FILES			:=	$(addsuffix .dep,$(OUT_ES6_FILES) $(OUT_LESS_FILES))
OUT_FOLDERS			:=	$(sort $(dir $(OUT_FILES)))

TARGET_DEPS			:=	$(OUT_FOLDERS) $(OUT_FILES)

BUILDS				:=	$(subst $(SRC)/,$(OUT)/.obj/,$(ALL_MAKEFILES))


# Tools #
BUBLE_ARGS			:=	--no modules --jsx h
BUBLE				=	buble $(BUBLE_ARGS) $(1) -o $(2)
# ES6 Compiler: https://buble.surge.sh/guide/
ROLLUP_ARGS			:=	
ROLLUP				=	rollup $(ROLLUP_ARGS) $(1)
# ES6 Include/Require Resolver: http://rollupjs.org/guide/
MINIFY_JS			=
# ???

LESS_COMMON			:=	--global-var='STATIC_DOMAIN=$(STATIC_DOMAIN)'
LESS_ARGS			:=	--autoprefix
LESS_DEP			=	lessc $(LESS_COMMON) --depends $(1) $(2)>$(2).dep
LESS				=	lessc $(LESS_COMMON) $(LESS_ARGS) $(1) $(2)
# CSS Compiler: http://lesscss.org/
MINIFY_CSS			=	cat $(1) | cleancss -o $(2)
# CSS Minifier: https://github.com/jakubpawlowicz/clean-css/

MINIFY_SVG			=
# ???

SIZE				=	cat $(1) | wc -c
GZIP_SIZE			=	gzip -c $(1) | wc -c
# Get size in bytes (compress and uncompressed)


# Rules #
default: target

clean:
	rm -fr $(OUT)
	
ifndef TARGET
target: $(BUILDS) #$(TARGET_DEPS)

$(BUILDS):
	@echo "[+] Building \"$(subst /Makefile,,$(subst $(OUT)/.obj/,,$@))\"..."
	@$(MAKE) --no-print-directory -C . -f $(subst $(OUT)/.obj/,$(SRC)/,$@)
endif

# Folder Rules #
$(OUT_FOLDERS):
	mkdir -p $@

# File Rules #
$(OUT)/%.es6.js:$(SRC)/%.js
	$(call BUBLE,$<,$@)

$(OUT)/%.o.js:$(SRC)/%.js
	cp $< $@

$(OUT)/%.less.css:$(SRC)/%.less
	$(call LESS,$<,$@); $(call LESS_DEP,$<,$@)

$(OUT)/%.o.css:$(SRC)/%.css
	cp $< $@

$(OUT)/%.o.svg:$(SRC)/%.svg
	cp $< $@

# Phony Rules #
.phony: default clean target $(BUILDS)

# Dependencies #
-include $(DEP_FILES)
