    $('a.add_question_addendum').bind('click', @openQuestionAddendumForm)
    $('a.cancel_question_addendum').bind('click', @cancelQuestionAddendum)
    $('form.question_addendum_form').bind('ajax:beforeSend', @hideFormEnableAddAddendumLink)
    $('form.question_addendum_form').bind('ajax:success', @appendQuestionAddendum)
