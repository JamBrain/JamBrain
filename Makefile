-include config.mk	# Create and use this file to override any of 'Settings' #

# Settings #
SRC					?=	src
OUT					?=	.output
.BUILD				?=	.build
NODEJS				?=	node_modules

# Use 'TARGET=public-ludumdare.com' if you want to build a specific build (such as public-ludumdare.com) #
ifneq ($(strip $(TARGET)),)
THE_MAKEFILES			:=	$(SRC)/$(subst /,,$(TARGET))/Makefile
endif # BUILD

# if JOBS are specified in config.mk, then use that to start a parallel build
ifdef JOBS
ifndef MAIN_FOLDER
$(info [*] Running with $(JOBS) JOBS)
endif # MAIN_FOLDER
JOBS				:=	-j $(JOBS)
endif # JOBS

ifndef MAIN_FOLDER
ifdef DEBUG
$(info [*] Debug output enabled)
endif # DEBUG
endif # MAIN_FOLDER

ifndef MAIN_FOLDER
ifdef SOURCEMAPS
$(info [*] Source Maps enabled)
endif # SOURCEMAPS
endif # MAIN_FOLDER

# TODO: REMOVE THIS
STATIC_DOMAIN		?=	static.jammer.work

# Copy un-minified files
ifdef WINDOWS_HOST
ifndef MAIN_FOLDER
$(info [*] Running on WINDOWS_HOST)
endif # MAIN_FOLDER
endif # WINDOWS_HOST

# Include Folders (modified by recursive scripts) #
ifdef INCLUDE_FOLDERS
INCLUDE_FOLDERS		+=	src/compat/
endif # INCLUDE_FOLDERS
INCLUDE_FOLDERS		?=	$(SRC)/
BUILD_FOLDER		:=	$(OUT)/$(.BUILD)/$(subst /,,$(TARGET))

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

ALL_ESIGNORE_FILES	:=	$(call FIND_FILE,$(SRC)/,.es6ignore)
ESIGNORE_FOLDERS	:=	$(addsuffix %,$(dir $(ALL_ESIGNORE_FILES)))

# Transforms #
ES_FILES 			:=	$(filter-out $(ESIGNORE_FOLDERS),$(ALL_JS_FILES))
JS_FILES 			:=	$(filter $(ESIGNORE_FOLDERS),$(ALL_JS_FILES))
LESS_FILES			:=	$(ALL_LESS_FILES)
CSS_FILES			:=	$(ALL_CSS_FILES)
SVG_FILES			:=	$(ALL_SVG_FILES)

OUT_ES_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(ES_FILES:.js=.es.js))
OUT_JS_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(JS_FILES:.js=.o.js))
OUT_LESS_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(LESS_FILES:.less=.less.css))
OUT_CSS_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(CSS_FILES:.css=.o.css))
OUT_SVG_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(SVG_FILES:.svg=.min.svg))

OUT_FILES_SVG		:=	$(OUT_SVG_FILES)
OUT_FILES_CSS		:=	$(OUT_CSS_FILES) $(OUT_LESS_FILES)
OUT_FILES_JS		:=	$(OUT_JS_FILES) $(OUT_ES_FILES)
OUT_FILES			:=	$(OUT_FILES_SVG) $(OUT_FILES_CSS) $(OUT_FILES_JS)
DEP_FILES			:=	$(addsuffix .dep,$(OUT_ES_FILES) $(OUT_LESS_FILES))
OUT_FOLDERS			:=	$(sort $(dir $(OUT_FILES) $(BUILD_FOLDER)/))

TARGET_FILES_SVG		:=	$(TARGET_FOLDER)/all.min.svg
TARGET_FILES_CSS		:=	$(TARGET_FOLDER)/all.min.css
TARGET_FILES_JS		:=	$(TARGET_FOLDER)/all.min.js
ifdef DEBUG
TARGET_FILES_CSS		+=	$(TARGET_FOLDER)/all.debug.css
TARGET_FILES_JS		+=	$(TARGET_FOLDER)/all.debug.js
endif # DEBUG
TARGET_FILES		:=	$(TARGET_FILES_SVG) $(TARGET_FILES_CSS) $(TARGET_FILES_JS)


# Tools #

# Ecmascript Linter: http://eslint.org/
ESLINT_ARGS			:=	--config src/config/eslint.config.json
ESLINT				=	$(NODEJS)/eslint/bin/eslint.js $(1) $(ESLINT_ARGS)
# ES Compiler: https://buble.surge.sh/guide/
BUBLE_ARGS			:=	--no modules --jsx h --objectAssign Object.assign
#ifdef SOURCEMAPS
#BUBLE_ARGS			+=	-m inline
#endif # SOURCEMAPS
BUBLE				=	$(NODEJS)/buble/bin/buble $(BUBLE_ARGS) -i $(1) -o $(2)
# ES Include/Require Resolver: http://rollupjs.org/guide/
ROLLUP_ARGS			:=	-c src/config/rollup.config.js
ifdef SOURCEMAPS
ROLLUP_ARGS			+=	-m inline
endif # SOURCEMAPS
ROLLUP				=	$(NODEJS)/rollup/dist/bin/rollup $(ROLLUP_ARGS) $(1) > $(2)
# JS Preprocessor: https://github.com/moisesbaez/preprocess-cli-tool
JS_PP_DEBUG			=	$(NODEJS)/preprocess-cli-tool/bin/preprocess.js -f $(1) -d $(2) -c '{"DEBUG": true}' -t js
JS_PP_RELEASE		=	$(NODEJS)/preprocess-cli-tool/bin/preprocess.js -f $(1) -d $(2) -t js
# JS Minifier: https://www.npmjs.com/package/uglify-js
MINIFY_JS_RESERVED	:=	VERSION_STRING,STATIC_DOMAIN
MINIFY_JS_ARGS		:=	--compress --mangle reserved=["$(MINIFY_JS_RESERVED)"]
MINIFY_JS			=	$(NODEJS)/uglify-js/bin/uglifyjs $(MINIFY_JS_ARGS) -o $(2) -- $(1)

# CSS Compiler: http://lesscss.org/
LESS_COMMON			:=	--global-var='STATIC_DOMAIN=$(STATIC_DOMAIN)' --include-path=$(MAIN_FOLDER)
LESS_ARGS			:=	--autoprefix
LESS_DEP			=	$(NODEJS)/less/bin/lessc $(LESS_COMMON) --depends $(1) $(2)>$(2).dep
LESS				=	$(NODEJS)/less/bin/lessc $(LESS_COMMON) $(LESS_ARGS) $(1) $(2)
# CSS Minifier: https://github.com/jakubpawlowicz/clean-css/
MINIFY_CSS			=	cat $(1) | $(NODEJS)/clean-css-cli/bin/cleancss -o $(2)
# CSS Linter: http://stylelint.io/
STYLELINT_ARGS			:=	--syntax less --config src/config/.stylelintrc --config-basedir ../../
STYLELINT				=	$(NODEJS)/stylelint/bin/stylelint.js $(1) $(STYLELINT_ARGS)

# SVG "Compiler", same as the minifier: https://github.com/svg/svgo
SVGO_ARGS			:=	-q --disable=removeTitle --disable=removeDimensions --disable=removeViewBox
SVGO				=	$(NODEJS)/svgo/bin/svgo $(SVGO_ARGS) -i $(1) -o $(2)
# Mike's SVG Sprite Packer: https://github.com/povrazor/svg-sprite-tools
SVG_PACK			=	src/tools/svg-sprite-pack $(1) > $(2)
# SVG Minifier: https://github.com/svg/svgo
MINIFY_SVG_ARGS		:=	--multipass --disable=cleanupIDs -q
MINIFY_SVG			=	$(NODEJS)/svgo/bin/svgo $(MINIFY_SVG_ARGS) -i $(1) -o $(2)

# Remove Empty Directories
RM_EMPTY_DIRS		=	find $(1) -type d -empty -delete 2>/dev/null |true

# Get size in bytes (compress and uncompressed)
SIZE				=	cat $(1) | wc -c
GZIP_SIZE			=	gzip -c $(1) | wc -c

ifneq ($(NOCOLOR),1)
COL_OFF				=	\e[0m
COL_RED				=	\e[91m
COL_GREEN			=	\e[92m
COL_YELLOW			=	\e[93m
COL_BLUE			=	\e[94m
COL_PURPLE			=	\e[95m
COL_CYAN			=	\e[96m
COL_WHITE			=	\e[97m
endif

# Rules #
default: target

report: $(TARGET_FILES)
	@echo \
		"[$(COL_GREEN)JS_RAW$(COL_OFF)]  GZIP: `$(call GZIP_SIZE,$(BUILD_FOLDER)/all.js 2>/dev/null)` MINIFY: N/A	ORIGINAL: `$(call SIZE,$(BUILD_FOLDER)/all.js 2>/dev/null)`\n" \
		"[$(COL_GREEN)JS_DEBUG$(COL_OFF)]  GZIP: `$(call GZIP_SIZE,$(TARGET_FOLDER)/all.debug.js 2>/dev/null)` MINIFY: `$(call SIZE,$(TARGET_FOLDER)/all.debug.js 2>/dev/null)`*	ORIGINAL: `$(call SIZE,$(BUILD_FOLDER)/all.debug.js 2>/dev/null)`\n" \
		"[$(COL_GREEN)JS_RELEASE$(COL_OFF)]  GZIP: `$(call GZIP_SIZE,$(TARGET_FOLDER)/all.min.js 2>/dev/null)`   MINIFY: `$(call SIZE,$(TARGET_FOLDER)/all.min.js 2>/dev/null)`    ORIGINAL: `$(call SIZE,$(BUILD_FOLDER)/all.release.js 2>/dev/null)`\n" \
		"[$(COL_GREEN)CSS$(COL_OFF)]     GZIP: `$(call GZIP_SIZE,$(TARGET_FOLDER)/all.min.css 2>/dev/null)`  MINIFY: `$(call SIZE,$(TARGET_FOLDER)/all.min.css 2>/dev/null)`	ORIGINAL: `$(call SIZE,$(BUILD_FOLDER)/all.css 2>/dev/null)`\n" \
		"[$(COL_GREEN)SVG$(COL_OFF)]     GZIP: `$(call GZIP_SIZE,$(TARGET_FOLDER)/all.min.svg 2>/dev/null)`  MINIFY: `$(call SIZE,$(TARGET_FOLDER)/all.min.svg 2>/dev/null)`	ORIGINAL: `$(call SIZE,$(BUILD_FOLDER)/all.svg 2>/dev/null)`\n" \
		| column -t

# If not called recursively, figure out who the targes are and call them #
ifndef MAIN_FOLDER # ---- #

# MAKEFILES is a reserved word, so we're using THE_MAKEFILES
THE_MAKEFILES		?=	$(call FIND_FILE,$(SRC)/,Makefile)
BUILDS				:=	$(subst $(SRC)/,$(OUT)/$(.BUILD)/,$(THE_MAKEFILES))
ALL_MAKEFILES		:=	$(call FIND_FILE,$(SRC)/,Makefile)
ALL_BUILDS			:=	$(subst $(SRC)/,$(OUT)/$(.BUILD)/,$(ALL_MAKEFILES))


# Recursively re-call this makefile for all TARGETs
clean:
	@$(foreach b,$(THE_MAKEFILES),$(MAKE) clean -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
clean-svg:
	@$(foreach b,$(THE_MAKEFILES),$(MAKE) clean-svg -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
clean-css:
	@$(foreach b,$(THE_MAKEFILES),$(MAKE) clean-css -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
clean-js:
	@$(foreach b,$(THE_MAKEFILES),$(MAKE) clean-js -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
clean-lint:
	@$(foreach b,$(THE_MAKEFILES),$(MAKE) clean-lint -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)

clean-all:
	@$(foreach b,$(ALL_MAKEFILES),$(MAKE) clean -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
clean-all-svg:
	@$(foreach b,$(ALL_MAKEFILES),$(MAKE) clean-svg -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
clean-all-css:
	@$(foreach b,$(ALL_MAKEFILES),$(MAKE) clean-css -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
clean-all-js:
	@$(foreach b,$(ALL_MAKEFILES),$(MAKE) clean-js -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
clean-all-lint:
	@$(foreach b,$(ALL_MAKEFILES),$(MAKE) clean-lint -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)

clean-version:
	-rm $(OUT)/git-version.php

clean-some:
	@$(foreach b,$(THE_MAKEFILES),$(MAKE) clean-some -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)

mini: clean-version target

lint: lint-svg lint-css lint-js lint-php
lint-svg:
	@$(foreach b,$(THE_MAKEFILES),$(MAKE) lint-svg -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
lint-css:
	@$(foreach b,$(THE_MAKEFILES),$(MAKE) lint-css -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
lint-js:
	@$(foreach b,$(THE_MAKEFILES),$(MAKE) lint-js -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
lint-php:
	@$(foreach b,$(THE_MAKEFILES),$(MAKE) lint-php -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)

lint-all: lint-all-svg lint-all-css lint-all-js lint-all-php
lint-all-svg:
	@$(foreach b,$(ALL_MAKEFILES),$(MAKE) lint-svg -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
lint-all-css:
	@$(foreach b,$(ALL_MAKEFILES),$(MAKE) lint-css -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
lint-all-js:
	@$(foreach b,$(ALL_MAKEFILES),$(MAKE) lint-js -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)
lint-all-php:
	@$(foreach b,$(ALL_MAKEFILES),$(MAKE) lint-php -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)


all: $(ALL_BUILDS) $(OUT)/git-version.php
target: $(BUILDS) $(OUT)/git-version.php
# NOTE: git-version should be last! Generation of this file doubles as the "install complete" notification.

$(ALL_BUILDS):
	@echo "[$(COL_YELLOW)+$(COL_OFF)] Building \"$(subst /Makefile,,$(subst $(OUT)/$(.BUILD)/,,$@))\"..."
	@$(MAKE) --no-print-directory $(JOBS) -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$@)

else # MAIN_FOLDER # ---- #

# Folder Rules #
$(OUT_FOLDERS):
	mkdir -p $@


lint-svg:
lint-css: $(LESS_FILES)
	@echo "[$(COL_BLUE)LESS LINT BATCH$(COL_OFF)] $^"
	@$(call STYLELINT,$^)
lint-js: $(ES_FILES)
	@echo "[$(COL_GREEN)ES LINT BATCH$(COL_OFF)] $^"
	@$(call ESLINT,$^)
lint-php:

clean-lint:
	rm -fr $(BUILD_FOLDER)/buble.lint $(BUILD_FOLDER)/less.lint


$(BUILD_FOLDER)/buble.lint: $(ES_FILES)
	@echo "[$(COL_GREEN)ES LINT$(COL_OFF)] $?"
	@$(call ESLINT,$?)
	@touch $@

$(BUILD_FOLDER)/less.lint: $(LESS_FILES)
	@echo "[$(COL_BLUE)LESS LINT$(COL_OFF)] $?"
	@$(call STYLELINT,$?)
	@touch $@


# File Rules #
$(OUT)/%.es.js:$(SRC)/%.js
	@echo "[$(COL_GREEN)ES->JS$(COL_OFF)] $<"
	@$(call BUBLE,$<,$@)

$(OUT)/%.o.js:$(SRC)/%.js
	@echo "[$(COL_GREEN)Copy JS$(COL_OFF)] $<"
	@cp $< $@

$(OUT)/%.less.css:$(SRC)/%.less
	@echo "[$(COL_BLUE)LESS->CSS$(COL_OFF)] $<"
	@$(call LESS,$<,$@); $(call LESS_DEP,$<,$@)

$(OUT)/%.o.css:$(SRC)/%.css
	@echo "[$(COL_BLUE)Copy CSS$(COL_OFF)] $<"
	@cp $< $@

$(OUT)/%.min.svg:$(SRC)/%.svg
	@echo "[$(COL_CYAN)SVG MIN$(COL_OFF)] $<"
	@$(call SVGO,$<,$@)


clean:
	rm -fr $(OUT) $(TARGET_FILES)
clean-svg:
	rm -fr $(OUT_FILES_SVG) $(OUT_FILES_SVG:.svg=.svg.out) $(TARGET_FILES_SVG) $(BUILD_FOLDER)/svg.svg $(BUILD_FOLDER)/all.svg
	-$(call RM_EMPTY_DIRS,.output)
clean-css:
	rm -fr $(OUT_FILES_CSS) $(OUT_LESS_FILES:.less.css=.less) $(OUT_LESS_FILES:.less.css=.less.css.dep) $(TARGET_FILES_CSS) $(BUILD_FOLDER)/less.css $(BUILD_FOLDER)/css.css $(BUILD_FOLDER)/less.lint $(BUILD_FOLDER)/all.css
	-$(call RM_EMPTY_DIRS,.output)
clean-js:
	rm -fr $(OUT_FILES_JS) $(OUT_ES_FILES:.es.js=.js) $(OUT_ES_FILES:.es.js=.js.dep) $(TARGET_FILES_JS) $(BUILD_FOLDER)/js.js $(BUILD_FOLDER)/buble.js $(BUILD_FOLDER)/buble.lint $(BUILD_FOLDER)/all.js
	-$(call RM_EMPTY_DIRS,.output)
clean-some:
	rm -fr $(OUT_FILES) $(OUT_FILES_SVG:.svg=.svg.out) $(OUT_LESS_FILES:.less.css=.less) $(OUT_LESS_FILES:.less.css=.less.css.dep) $(OUT_ES_FILES:.es.js=.js) $(OUT_ES_FILES:.es.js=.js.dep)
	-$(call RM_EMPTY_DIRS,.output)


OUT_MAIN_JS			:=	$(subst $(SRC)/,$(OUT)/,$(MAIN_JS:.js=.es.js))


# JavaScript #
$(BUILD_FOLDER)/js.js: $(OUT_JS_FILES)
	@echo "[$(COL_PURPLE)MERGE$(COL_OFF)] $@"
	@cat $^ > $@
$(BUILD_FOLDER)/buble.js: $(OUT_MAIN_JS) $(OUT_ES_FILES)
	@echo "[$(COL_PURPLE)ROLLUP$(COL_OFF)] $@"
	@$(call ROLLUP,$<,$@.tmp)
	@rm -f $@
	@mv $@.tmp $@
$(BUILD_FOLDER)/all.js: $(BUILD_FOLDER)/js.js $(BUILD_FOLDER)/buble.js
	@echo "[$(COL_PURPLE)MERGE$(COL_OFF)] $@"
	@cat $^ > $@
$(BUILD_FOLDER)/all.release.js: $(BUILD_FOLDER)/all.js
	@echo "[$(COL_PURPLE)JS Preprocess Tool$(COL_OFF)] $@"
	@$(call JS_PP_RELEASE,$<,$@)
$(TARGET_FOLDER)/all.min.js: $(BUILD_FOLDER)/all.release.js
	@echo "[$(COL_PURPLE)JS MIN$(COL_OFF)] $@"
	@$(call MINIFY_JS,$<,$@)
$(BUILD_FOLDER)/all.debug.js: $(BUILD_FOLDER)/all.js
	@echo "[$(COL_PURPLE)JS Preprocess Tool$(COL_OFF)] $@"
	@$(call JS_PP_DEBUG,$<,$@)
$(TARGET_FOLDER)/all.debug.js: $(BUILD_FOLDER)/all.debug.js
	@echo "[$(COL_PURPLE)Copy JS$(COL_OFF)] $@"
	@cp -f --remove-destination $< $@

#	$(call JS_PP_DEBUG,$<,$(@D)/all.debug.js)

#	$(call MINIFY_JS,$<,$@)
#
#ifdef DEBUG
#	cp -f --remove-destination $(<D)/all.debug.js $(@D)/all.debug.js
#endif


# CSS #
$(BUILD_FOLDER)/css.css: $(OUT_CSS_FILES)
	cat $^ > $@
$(BUILD_FOLDER)/less.css: $(OUT_LESS_FILES)
	cat $^ > $@
$(BUILD_FOLDER)/all.css: $(BUILD_FOLDER)/css.css $(BUILD_FOLDER)/less.css
	cat $^ > $@
$(TARGET_FOLDER)/all.min.css: $(BUILD_FOLDER)/all.css
	$(call MINIFY_CSS,$<,$@)
$(TARGET_FOLDER)/all.debug.css: $(BUILD_FOLDER)/all.css
	cp -f --remove-destination $< $@

#ifdef DEBUG
#	cp -f --remove-destination $< $(@D)/all.debug.css
#endif


# SVG # src/icons/icomoon/icons.svg
$(BUILD_FOLDER)/svg.svg: $(OUT_SVG_FILES)
	$(call SVG_PACK,$^,$@.out)
	rm -f $@
	mv $@.out $@
	# NOTE: needs to work like this, 'cause SVG_PACK outputs to stdout. Otherwise we wont stop on SVG errors
$(BUILD_FOLDER)/all.svg: $(BUILD_FOLDER)/svg.svg
	cat $^ > $@
$(TARGET_FOLDER)/all.min.svg: $(BUILD_FOLDER)/all.svg
	$(call MINIFY_SVG,$<,$@)


# Target #
target: $(OUT_FOLDERS) $(BUILD_FOLDER)/buble.lint $(BUILD_FOLDER)/less.lint $(TARGET_FILES) report
	@echo "[$(COL_YELLOW)-$(COL_OFF)] Done \"$(subst /,,$(TARGET))\""

endif # MAIN_FOLDER # ---- #


# Generate GIT VERSION file #
$(OUT)/git-version.php:
	@echo "[+] Generating \"$@\"..."
	@echo "<?php">$@
	@echo "// WARNING! DO NOT MODIFY! This file is automatically generated by Makefile!">>$@
	@echo "">>$@
	@echo "const GIT_VERSION = '$(shell git rev-list HEAD | wc -l)-$(shell git describe --always)';">>$@
	@echo "[-] Done \"$@\""


# Phony Rules #
.PHONY: default build target all clean clean-all clean-target clean-version clean-lint clean-svg clean-css clean-js clean-all-svg clean-all-css clean-all-js lint lint-all lint-svg lint-css lint-js lint-php lint-all-svg lint-all-css lint-all-js lint-all-php fail report $(BUILDS)


# Dependencies #
-include $(DEP_FILES)
