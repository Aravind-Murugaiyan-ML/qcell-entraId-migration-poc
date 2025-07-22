package mak.jhipster.doer;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import mak.jhipster.doer.config.AsyncSyncConfiguration;
import mak.jhipster.doer.config.EmbeddedElasticsearch;
import mak.jhipster.doer.config.EmbeddedKafka;
import mak.jhipster.doer.config.EmbeddedSQL;
import mak.jhipster.doer.config.TestSecurityConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { TodoserviceApp.class, AsyncSyncConfiguration.class, TestSecurityConfiguration.class })
@EmbeddedElasticsearch
@EmbeddedSQL
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@EmbeddedKafka
public @interface IntegrationTest {
}
