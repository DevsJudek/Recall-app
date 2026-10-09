import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yuyzjkdfpewkrehfvyfq.supabase.co',
  'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb'
);

async function fetchAllRows(tableName, filterCol, filterValues) {
    let allRows = [];
    let from = 0;
    const step = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from(tableName)
            .select('course_code, topic')
            .in(filterCol, filterValues)
            .range(from, from + step - 1);

        if (error) {
            console.error(error);
            break;
        }

        allRows = allRows.concat(data);

        if (data.length < step) {
            hasMore = false;
        } else {
            from += step;
        }
    }
    return allRows;
}

async function checkQuestions() {
  console.log("Fetching Labour Law (PUL 303) questions...");
  let labourData = await fetchAllRows('questions', 'course_code', ['PUL 303', 'PUL 301']);

  console.log("Fetching Commercial Law (BUL 305) questions...");
  let commercialData = await fetchAllRows('questions', 'course_code', ['BUL 305', 'BUL 301']);

  const groupData = (data) => {
      const grouped = {};
      data.forEach(row => {
          const key = `${row.course_code} - ${row.topic}`;
          grouped[key] = (grouped[key] || 0) + 1;
      });
      return grouped;
  };

  console.log("\nLabour Law Grouped by Topic:");
  console.log(groupData(labourData || []));

  console.log("\nCommercial Law Grouped by Topic:");
  console.log(groupData(commercialData || []));
}

checkQuestions();
