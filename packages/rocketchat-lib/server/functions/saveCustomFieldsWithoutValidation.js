RocketChat.saveCustomFieldsWithoutValidation = function(userId, formData) {
	if (s.trim(RocketChat.settings.get('Accounts_CustomFields')) !== '') {
		let customFieldsMeta;
		try {
			customFieldsMeta = JSON.parse(RocketChat.settings.get('Accounts_CustomFields'));
		} catch (e) {
			throw new Meteor.Error('error-invalid-customfield-json', 'Invalid JSON for Custom Fields');
		}

		const customFields = formData;

		// for fieldName, field of customFieldsMeta
		RocketChat.models.Users.setCustomFields(userId, customFields);

		Object.keys(customFields).forEach((fieldName) => {
			if (!customFieldsMeta[fieldName].modifyRecordField) {
				return;
			}

			const modifyRecordField = customFieldsMeta[fieldName].modifyRecordField;
			const update = {};
			if (modifyRecordField.array) {
				update.$addToSet = {};
				update.$addToSet[modifyRecordField.field] = customFields[fieldName];
			} else {
				update.$set = {};
				update.$set[modifyRecordField.field] = customFields[fieldName];
			}

			RocketChat.models.Users.update(userId, update);
		});
	}
};
