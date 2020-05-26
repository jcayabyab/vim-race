    $('li.assessment_question').on('click', 'a.add_question_addendum', @openQuestionAddendumForm)
    $('li.assessment_question').on('click', 'a.cancel_question_addendum', @cancelQuestionAddendum)
    $('li.assessment_question').on('ajax:beforeSend', 'form.question_addendum_form', @hideFormEnableAddAddendumLink)
    $('li.assessment_question').on('ajax:success', 'form.question_addendum_form', @appendQuestionAddendum)
