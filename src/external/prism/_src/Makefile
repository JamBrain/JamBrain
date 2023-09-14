
ALL_FILES			:=	$(wildcard *.js)
FIRST_FILES			:=	prism-core.js \
						prism-clike.js \
						prism-markup.js \
						prism-c.js \
						
LAST_FILES			:=	prism-line-numbers.js \


ORDERED_FILES		:=	$(FIRST_FILES) $(filter-out $(FIRST_FILES) $(LAST_FILES), $(ALL_FILES)) $(LAST_FILES)

../prism.js: $(ORDERED_FILES)
	cat $^ > $@
